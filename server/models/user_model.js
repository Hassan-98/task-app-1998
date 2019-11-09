const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Task = require("./task_model")

const Schema = mongoose.Schema({
   username: {
      type: String,
      trim: true,
      minlength: 7
   },
   email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate (val) {
         if(!validator.isEmail(val)) throw new Error("Email is Invalid")
      }
   },
   password: {
      type: String,
      required: true,
      minlength: 7
   },
   phone: {
      type: Number,
      trim: true,
      default: 0
   },
   age: {
      type: Number,
      trim: true,
      default: 0
   },
   photo: {
      type: Buffer
   },
   tokens: [{
      token: {
         type: String,
         required: true
      }
   }]
}, {
   timestamps: true
})

// User/Task Relationship
Schema.virtual("tasks", {
   ref: "Task",
   localField: "_id",
   foreignField: "author"
})


// Login A User
Schema.statics.login = async (email, password) => {
   const user = await User.findOne({ email })
   if (!user) throw Error("User Not Found")
   const passwordMacthed = await bcrypt.compare(password, user.password)
   if (!passwordMacthed) throw Error("Password is Incorrect")
   
   const token = jwt.sign({uid: user._id}, process.env.MOGODB_SECRET, {expiresIn: "7 days"})

   return {user, token}
}


// Hash Password Before Saving
Schema.pre("save", async function(next) {
   if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 8)
   next()
})

// Deleting All User Tasks Before Deleting User
Schema.pre("remove", async function(next) {
   const author = this._id
   await Task.deleteMany({author})
   next()
})

// The Model
const User = mongoose.model("User", Schema)

module.exports = User