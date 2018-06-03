const mongoose = require('mongoose');
const fs = require('fs');

const Schema = mongoose.Schema;

var GameSchema = new Schema({
    title: {type: String, unique: true, required: true},
    company: String,
    genre: String,
    platform: String,
    release_date: Date
}, { toJSON: { virtuals: true } });

GameSchema.virtual('image').get(function() {
    if(fs.existsSync('client/public/img/games/img-' + this._id)) {
        return 'img/games/img-' + this._id;
    }
    else {
        return '';
    }
});

//Export model
module.exports = mongoose.model('Game', GameSchema);