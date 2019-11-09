const mongoose = require("mongoose")

const Schema = mongoose.Schema({
   content: {
      type: String,
      required: true,
      trim: true,
      minlength: 10
   },
   state: {
      type: Boolean,
      default: false
   },
   author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
   }
}, {
   timestamps: true
})

module.exports = mongoose.model("Task", Schema)