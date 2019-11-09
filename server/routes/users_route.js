const express = require("express")
const router = new express.Router()
const auth = require("../middleware/auth_middleware")
const multer = require("multer")
const flash = require("connect-flash")

// Models
const User = require("../models/user_model")

// Image Upload
const imageUpload = multer({
   limits: {
      fileSize: 1024 * 1024 * 2
   }
})


// Creating A New User
router.post("/users", async (req, res) => {
   try {
      if (req.body && req.body["confirm password"] !== req.body.password) throw new Error("Password Is Not Match")
      await new User(req.body).save()
      res.redirect("/login")
   } catch (e) {
      req.flash("signupError", e.message)
      res.redirect("/signup")
   }
})

// Login a User
router.post("/users/login", async (req, res) => {
   try {
      const userData = await User.login(req.body.email, req.body.password)
      req.session.user = userData.user
      req.session.token = userData.token
      res.redirect("/")
   } catch (e) {
      req.flash("loginError", e.message)
      res.redirect("/login")
   }
})

// Logout a User
router.post("/users/logout", auth, (req, res) => {
   try {
      req.session.destroy(function(err) {
         if(err){
            console.log(err);
         } else {
             res.redirect('/');
         }
      })
   } catch (e) {
      req.flash("logoutError", e.message)
      res.redirect("/")
   }
})

// Logout rom All Sessions
router.post("/users/logoutAll", auth, async (req, res) => {
   try {
      req.user.tokens = []
      const user = await req.user.save()
      res.status(200).send(user)
   } catch (e) {
      res.status(401).send(e.message)
   }
})


// Get A User 
router.get("/users/me", auth, async (req, res) => {
   const id = req.session.user._id
   try {
      const user = await User.findById(id)

      res.status(200).send(user)
   } catch (e) {
      res.status(400).send(e.message)
   }
})


// Updating A User Data
router.patch("/users/me", auth, async (req, res) => {
   const id = req.session.user._id
   const updates = Object.keys(req.body)
   try {
      const user = await User.findById(id)
      updates.forEach(update => user[update] = req.body[update])
      const updatedUser = await user.save()
      req.session.user = updatedUser
      res.status(200).send(updatedUser)
   } catch (e) {
      res.status(400).send(e.message)
   }
})


// Upload New Avatar
router.post("/users/uploadAvatar", auth, imageUpload.single("avatar"), async (req, res) => {
   const user = await User.findById(req.session.user._id)
   user.photo = req.file.buffer
   await user.save()
   user.photo = Buffer.from(user.photo.buffer).toString('base64')
   req.session.user = user
   res.status(200).send("Image Uploaded Successfully")
}, (err, req, res) => res.status(400).send(err.message))


// Deleteing an Avatar
router.delete("/users/deleteAvatar", auth, async (req, res) => {
   req.user.avatar = undefined
   await req.user.save()
   res.send()
})


// getting user avatar
router.get("/users/:id/avatar", async (req, res) => {
   try {
      const user = await User.findById(req.params.id)
      if (!user || !user.photo) throw new Error("Avatar Not Found") 
      res.set("Content-Type", "image/jpg")
      res.send(user.photo)
   } catch (e) {
      res.status(404).send(e.message)
   }
})


// Deleting A User 
router.delete("/users/me", auth, async (req, res) => {
   const id = req.session.user._id
   try {
      const deletedUser = await User.findByIdAndRemove(id)

      res.status(200).send(deletedUser)
   } catch (e) {
      res.status(400).send(e.message)
   }
})

module.exports = router