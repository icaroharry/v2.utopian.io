const mongoose = require("mongoose")
const Schema = mongoose.Schema

let ObjectId = Schema.Types.ObjectId

let Group = new Schema({
    name: String,
    member: [ObjectId],
    createAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('group', Group)