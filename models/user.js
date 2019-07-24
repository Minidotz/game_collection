const mongoose = require('mongoose');
const fs = require('fs');

const Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: String,
    nickname: {type: String, unique: true, required: true},
    email: String,
    collections: [{
        name: String,
        games: [{
            type: Schema.Types.ObjectId, ref: 'Game'
        }]
    }],
    wishlists: [{
        name: String,
        games: [{
            type: Schema.Types.ObjectId, ref: 'Game'
        }]
    }],
    createDate: {
        type: Date,
        default: Date.now
    },
    modDate: Date,
    picture: String
}, { toJSON: { virtuals: true } });

UserSchema.virtual('image').get(function() {
    if(fs.existsSync('client/public/img/games/img-' + this.guid)) {
        return 'img/games/img-' + this.guid;
    }
    else {
        return '';
    }
});

UserSchema.pre('findOneAndUpdate', function () {
    this.update({}, { $set: { modDate: new Date() } });
});

//Export model
module.exports = mongoose.model('User', UserSchema);