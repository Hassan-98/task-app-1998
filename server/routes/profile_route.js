const router = require("express").Router()
const User = require("../models/user_model")
const auth = require("../middleware/auth_middleware")

router.get("/profile", auth, async (req, res) => {
   res.render("profile", {
      user: req.session.user
   })
})

module.exports = router