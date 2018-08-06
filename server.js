const express = require('express');
require('dotenv').config();
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const mongoose = require('mongoose');
const port = process.env.PORT || 5000;
const API_KEY = process.env.API_KEY;
const Moment = require('moment');
const multer = require('multer');
const request = require('request');
const imgStoragePath = 'client/public/img/games/';

let storage = multer.diskStorage({
    destination: imgStoragePath,
    filename: function (req, file, cb) {
        cb(null, req.body.guid);
    }
})
const upload = multer({storage: storage});

mongoose.connect('mongodb://localhost/games');
let Game = require('./models/game');
let Search = require('./models/search');

app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));

app.use(express.static('client/public'));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

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

app.get('/game/:gameId', (req, res) => {
    request({
        url: 'http://www.giantbomb.com/api/game/' + req.params.gameId,
        headers: {
            'User-Agent': 'myUseragent'
        },
        qs: {
            format: 'json',
            api_key: API_KEY
        },
        json: true
    }, (e, r, json) => {
        if(fs.existsSync(imgStoragePath + 'img-' + req.params.gameId)) {
            json.results.myImage = '../img/games/img-' + req.params.gameId;
        }
        res.json(json);
    });
});

app.get('/getSuggestions', (req, res) => {
    request({
        url: 'http://www.giantbomb.com/api/search',
        headers: {
            'User-Agent': 'myUseragent'
        },
        qs: {
            format: 'json',
            api_key: API_KEY,
            query: req.query.search,
            resources: 'game',
            field_list: ['name','guid']
        }
    }).pipe(res);
});

app.get('/inCollection/:gameId', (req, res) => {
    Game.findOne({ guid: req.params.gameId, inCollection: true }, (err, g) => {
        if(err) {
            console.log(err);
        }
        else {
            g && res.json(g);
        }
    });
});

app.get('/searches', (req, res) => {
    Search.find({}, (err, searches) => {
        if (!err) {
            res.json(searches);
        }
        else {
            console.log(err);
        }
    });
});

app.get('/platforms', (req, res) => {
    let platforms = ['PC', 'Mac', 'PS4', 'PS3', 'Xbox One', 'Switch', 'Wii U', 'Vita', 'Xbox 360', '3DS'];
    res.json(platforms);
});

app.post('/add', (req, res) => {
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

app.post('/update', (req, res) => {
    let id = req.body._id;
    Game.findByIdAndUpdate(id, req.body, (err, res) => {
        if(err) console.log(err);
    })
});

app.post('/delete', (req, res) => {
    let id = req.body.id;
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
                request({
                    url: data.image,
                    headers: {
                        'User-Agent': 'myUseragent'
                    }
                }).pipe(fs.createWriteStream(imgStoragePath + 'img-' + g.guid));
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