const mongoose = require("mongoose")
const Schema = mongoose.Schema

let ObjectId = Schema.Types.ObjectId

let User = new Schema({
    name: String,
    friends: [ObjectId],
    groups: [ObjectId],
    createAt: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model('user', User)