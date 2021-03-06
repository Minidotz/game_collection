const mongoose = require('mongoose');
const fs = require('fs');

const Schema = mongoose.Schema;

var GameSchema = new Schema({
    title: {type: String, unique: true, required: true},
    guid: String,
    inCollection: Boolean,
    inWishlist: Boolean,
    createDate: {
        type: Date,
        default: Date.now
    },
    modDate: Date
}, { toJSON: { virtuals: true } });

GameSchema.virtual('image').get(function() {
    if(fs.existsSync('client/public/img/games/img-' + this.guid)) {
        return 'img/games/img-' + this.guid;
    }
    else {
        return '';
    }
});

GameSchema.pre('findOneAndUpdate', function () {
    this.update({}, { $set: { modDate: new Date() } });
});

//Export model
module.exports = mongoose.model('Game', GameSchema);