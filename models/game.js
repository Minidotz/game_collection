const mongoose = require('mongoose');
const fs = require('fs');

const Schema = mongoose.Schema;

var GameSchema = new Schema({
    title: {type: String, unique: true, required: true},
    guid: String,
    inCollection: Boolean,
    inWishlist: Boolean
}, { toJSON: { virtuals: true } });

GameSchema.virtual('image').get(function() {
    if(fs.existsSync('client/public/img/games/img-' + this.guid)) {
        return 'img/games/img-' + this.guid;
    }
    else {
        return '';
    }
});

//Export model
module.exports = mongoose.model('Game', GameSchema);