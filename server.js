const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const mongoose = require('mongoose');
const port = process.env.PORT || 5000;
const Moment = require('moment');
const multer = require('multer');

let storage = multer.diskStorage({
    destination: 'client/public/img/games/',
    filename: function (req, file, cb) {
        cb(null, req.body.id);
    }
})
const upload = multer({storage: storage});

mongoose.connect('mongodb://localhost/games');
let Game = require('./models/game');

app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));

app.use(express.static('client/public'));

app.get('/games', (req, res) => {
    Game.find((err, games) => {
        if (!err) {
            res.json(games);
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
                fs.writeFileSync('client/public/img/games/img-' + g._id, bufferedData);
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
            if(fs.existsSync('client/public/img/games/img-' + id)) {
                //Delete cover image
                fs.unlink('client/public/img/games/img-' + id, err => {
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

app.listen(port, () => console.log(`Listening on port ${port}`));