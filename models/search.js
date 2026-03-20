import mongoose from 'mongoose';
import fs from 'fs';

const Schema = mongoose.Schema;

var SearchSchema = new Schema({
    title: {type: String, unique: true, required: true},
    guid: String,
    createDate: {
        type: Date,
        default: Date.now
    }
}, { toJSON: { virtuals: true } });

SearchSchema.virtual('image').get(function() {
    if(fs.existsSync('client/public/img/games/img-' + this.guid)) {
        return 'img/games/img-' + this.guid;
    }
    else {
        return '';
    }
});

SearchSchema.pre('findOneAndUpdate', function () {
    this.update({}, { $set: { createDate: new Date() } });
});

//Export model
export default mongoose.model('Search', SearchSchema);