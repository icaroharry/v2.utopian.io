const Mongoose = require('mongoose')

const Schema = Mongoose.Schema
const tips = new Schema({
  objRef: { type: String, required: true },
  objId: { type: Schema.Types.ObjectId, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'Users' },
  currency: { type: String, required: true, enum: ['bitcoin', 'litecoin', 'ethereum', 'steem', 'sbd', 'steempower'] },
  amount: { type: Number, required: true },
  anonymous: { type: Boolean, required: true, default: false },
  data: { type: Object },
  createdAt: { type: Date, default: Date.now }
})

module.exports = Mongoose.model('Tip', tips, 'tips')
