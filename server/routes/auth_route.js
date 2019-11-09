const router = require("express").Router()
const noAuth = require("../middleware/noauth_middleware")

router.get("/login", noAuth, async (req, res) => {
   res.render("login", {
      error: req.flash("loginError")[0]
   })
})

router.get("/signup", noAuth, async (req, res) => {
   res.render("signup", {
      error: req.flash("signupError")[0]
   })
})

module.exports = router