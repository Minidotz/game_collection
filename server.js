import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';
import fs from 'fs';
import mongoose from 'mongoose';
import { format, subDays } from 'date-fns';
import multer from 'multer';
import { fileURLToPath } from 'url';
import sanitizeHtml from 'sanitize-html';
import Game from './models/game.js';
import Search from './models/search.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const API_KEY = process.env.API_KEY;
const RAWG_KEY = process.env.RAWG_KEY;
const DB_NAME = process.env.DB_NAME;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imgStoragePath = 'client/public/img/games/';

let storage = multer.diskStorage({
    destination: imgStoragePath,
    filename: function (req, file, cb) {
        cb(null, req.body.guid);
    }
})
const upload = multer({storage: storage});

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/' + DB_NAME, (err) =>{
    if(err) {
        console.error(`Unable to connect to MongoDB server. Error:`, err.stack);
        process.exit(1);
    }
    else {
        console.log('Connected to MongoDB server successfully!');
    }
});

app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({limit: '10mb', extended: true}));

const rawgBaseUrl = 'https://api.rawg.io/api/';

async function rawgFetchJson(endpoint, params) {
    const url = new URL(endpoint, rawgBaseUrl);
    const searchParams = new URLSearchParams({
        key: RAWG_KEY,
        ...params,
    });
    url.search = searchParams.toString();

    const response = await fetch(url, {
        headers: { 'User-Agent': 'game-collection' },
    });

    if (!response.ok) {
        throw new Error(`RAWG request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

async function downloadImage(url, targetPath) {
    const response = await fetch(url, {
        headers: { 'User-Agent': 'game-collection' },
    });

    if (!response.ok) {
        throw new Error(`Image download failed: ${response.status} ${response.statusText}`);
    }

    if (!response.body) {
        throw new Error('Image download failed: empty response body');
    }

    await pipeline(Readable.fromWeb(response.body), fs.createWriteStream(targetPath));
}

app.use(express.static(path.join(__dirname, 'client', 'public')));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// app.use(express.static(path.join(__dirname, 'client', 'build')));
// app.get('/', function (req, res) {
//     res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
//   });

app.get('/games', (req, res) => {
    Game.find({ inCollection: true }, (err, games) => {
        if (!err) {
            res.json(games);
        }
        else {
            console.log(err);
        }
    });
});

app.get('/games/:gameId', async (req, res) => {
    const rawgId = req.params.gameId;
    if (!RAWG_KEY) {
        console.error('RAWG_KEY not configured in environment');
        return res.status(502).json({ error: 'RAWG_KEY not configured' });
    }

    try {
        const json = await rawgFetchJson(`games/${rawgId}`, {});
        const guid = json && json.id ? String(json.id) : String(req.params.gameId);

        const sanitizedDescription = sanitizeHtml(json.description || '', {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
            allowedAttributes: {
                a: ['href', 'name', 'target', 'rel'],
                img: ['src', 'alt'],
            },
            allowedSchemes: ['http', 'https', 'mailto'],
        });

        const result = {
            name: json.name,
            guid: guid,
            description: sanitizedDescription,
            deck: json.short_description || '',
            image: {
                medium_url: json.background_image,
            },
            // RAWG: genres is an array of {id, name}
            genres: Array.isArray(json.genres) ? json.genres.map(g => ({ id: g.id, name: g.name })) : [],
            // Normalize platforms to array of { id, name }
            platforms: Array.isArray(json.platforms)
                ? json.platforms.map(p => ({ id: p.platform && p.platform.id ? p.platform.id : null, name: p.platform && p.platform.name ? p.platform.name : (p.name || null) }))
                : [],
            original_release_date: json.released || (json.releases && json.releases[0] && json.releases[0].date) || null,
            developers: Array.isArray(json.developers) ? json.developers.map(d => ({ name: d.name })) : [],
            publishers: Array.isArray(json.publishers) ? json.publishers.map(p => ({ name: p.name })) : [],
        };

        if (fs.existsSync(imgStoragePath + 'img-' + guid)) {
            result.myImage = '../img/games/img-' + guid;
        }

        res.json({ results: result });
    } catch (error) {
        console.error('Error fetching RAWG game details', error);
        return res.status(502).json({ results: null });
    }
});

app.get('/games/:gameId/screenshots', async (req, res) => {
    const rawgId = req.params.gameId;
    if (!RAWG_KEY) {
        console.error('RAWG_KEY not configured in environment');
        return res.status(502).json({ error: 'RAWG_KEY not configured' });
    }

    try {
        const json = await rawgFetchJson(`games/${rawgId}/screenshots`, { page_size: 20 });
        if (!json || !Array.isArray(json.results)) {
            console.error('Error fetching RAWG screenshots', json);
            return res.status(502).json({ results: [] });
        }

        const results = json.results.map(s => ({ original_url: s.image, small_url: s.image }));
        res.json({ results });
    } catch (error) {
        console.error('Error fetching RAWG screenshots', error);
        return res.status(502).json({ results: [] });
    }
});

app.get('/suggestions', async (req, res) => {
    if (!RAWG_KEY) {
        console.error('RAWG_KEY not configured in environment');
        return res.status(502).json({ results: [] });
    }

    try {
        const json = await rawgFetchJson('games', { search: req.query.search, page_size: 10 });
        if (!json || !Array.isArray(json.results)) {
            console.error('Error fetching RAWG search results', json);
            return res.status(502).json({ results: [] });
        }

        const results = json.results.map(g => ({ name: g.name, guid: g.id ? String(g.id) : String(g.slug || g.name) }));
        res.json({ results });
    } catch (error) {
        console.error('Error fetching RAWG search results', error);
        return res.status(502).json({ results: [] });
    }
});

app.get('/inCollection/:gameId', (req, res) => {
    Game.findOne({ guid: req.params.gameId, inCollection: true }, (err, g) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (!g) {
            return res.json({ found: false });
        }

        return res.json({ found: true });
    });
});

app.get('/searches', (req, res) => {
    Search.find({}, (err, searches) => {
        if (!err) {
            res.json(searches);
        }
        else {
            console.log(err);
            res.status(500).json({ error: 'Database error' });
        }
    });
});

app.get('/platforms', (req, res) => {
    let platforms = [{
        name: 'PC',
        id: 94
    },{
        name: 'MAC',
        id: 17
    },{
        name: 'PS4',
        id: 146
    },{
        name: 'PS3',
        id: 35
    },{
        name: 'Xbox 360',
        id: 20
    },{
        name: 'Xbox One',
        id: 145
    },{
        name: 'Switch',
        id: 157
    },{
        name: '3DS',
        id: 117
    },{
        name: 'Wii U',
        id: 139
    }];
    res.json(platforms);
});

app.get('/releases/:platformId', async (req, res) => {
    const limit = req.query.limit || 100;
    // Use RAWG as a replacement for GiantBomb releases endpoint
    // Map our internal platform IDs to platform names (used for filtering)
    const PLATFORM_MAP = {
        94: 'PC',
        17: 'MAC',
        146: 'PS4',
        35: 'PS3',
        20: 'Xbox 360',
        145: 'Xbox One',
        157: 'Switch',
        117: '3DS',
        139: 'Wii U',
    };

    if (!RAWG_KEY) {
        console.error('RAWG_KEY not configured in environment');
        return res.status(502).json({ error: 'RAWG_KEY not configured' });
    }

    const platformName = PLATFORM_MAP[req.params.platformId];
    const endDate = format(new Date(), 'yyyy-MM-dd');
    const startDate = format(subDays(new Date(), 30), 'yyyy-MM-dd');

    try {
        const json = await rawgFetchJson('games', {
            dates: `${startDate},${endDate}`,
            ordering: '-released',
            page_size: limit,
        });

        if (!json || !Array.isArray(json.results)) {
            console.error('Error fetching RAWG releases or malformed response', json);
            return res.status(502).json({ results: [] });
        }

        let results = json.results;
        if (platformName) {
            results = results.filter(g =>
                Array.isArray(g.platforms) &&
                g.platforms.some(p => p.platform && p.platform.name && p.platform.name.toLowerCase().includes(platformName.toLowerCase()))
            );
        }

        const formatted = {
            results: results
                .filter(item => item.id !== undefined && item.id !== null)
                .map(item => ({
                    _id: item.id,
                    guid: String(item.id),
                    title: item.name,
                    image: item.background_image,
                    platform: item.platforms,
                })),
        };

        res.json(formatted);
    } catch (error) {
        console.error('Error fetching RAWG releases or malformed response', error);
        return res.status(502).json({ results: [] });
    }
});

app.post('/games', (req, res) => {
    let data = req.body;
    let game = new Game({
        title: data.title,
        company: data.company,
        genre: data.genre,
        platform: data.platform,
        release_date: data.release_date
    });
    game.save((err, g) => {
        if(err) {
            console.log(err);
        }
        else {
            if(req.body.image) {
                let cover = req.body.image;
                //Strip off base64 part from the cover data
                coverData = cover.replace(/^data:image\/\w+;base64,/, "");
                let bufferedData = Buffer.from(coverData, 'base64');
                fs.writeFileSync(imgStoragePath + 'img-' + g._id, bufferedData);
            }
        }
    });
});

app.put('/games/:gameId', (req, res) => {
    let id = req.params.gameId;
    Game.findByIdAndUpdate(id, req.body, (err, res) => {
        if(err) console.log(err);
    })
});

app.delete('/games/:gameId', (req, res) => {
    let id = req.params.gameId;
    Game.findByIdAndRemove(id, (err, res) => {
        if(err) { 
            console.log(err);
        }
        else {
            if(fs.existsSync(imgStoragePath + 'img-' + id)) {
                //Delete cover image
                fs.unlink(imgStoragePath + 'img-' + id, err => {
                    if(err) {
                        console.log(err);
                    }
                });
            }
        }
    })
});

app.post('/upload', upload.single('img'), (req, res) => {
});

app.post('/add_to_collection', (req, res, next) => {
    let data = req.body;
    let game = {
        title: data.title,
        guid: data.guid,
        inCollection: true
    };
    Game.findOneAndUpdate({guid: data.guid}, game, {upsert: true, new: true, setDefaultsOnInsert: true}, (err, g) => {
        if(err) {
            next(err);
        }
        else {
            if(data.image && !fs.existsSync(imgStoragePath + 'img-' + g.guid)) {
                downloadImage(data.image, imgStoragePath + 'img-' + g.guid).catch((error) => {
                    console.error('Error downloading game image', error);
                });
            }
            res.sendStatus(200);
        }
    });
});

app.post('/removeFromCollection', (req, res) => {
    Game.findOneAndUpdate({ guid: req.body.guid, inCollection: true }, { inCollection: false }, (err, g) => {
        if(err) {
            console.log(err)
        }
        else {
            res.sendStatus(200);
        }
    });
});

app.post('/searches', (req, res, next) => {
    let data = req.body;
    let search = {
        title: data.title,
        guid: data.guid
    }
    Search.findOneAndUpdate({guid: data.guid}, search, {upsert: true, new: true, setDefaultsOnInsert: true}, (err, g) => {
        if(err) {
            next(err);
        }
        else {
            res.sendStatus(200);
        }
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));