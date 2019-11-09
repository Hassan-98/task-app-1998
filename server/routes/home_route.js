const router = require("express").Router()
const noAuth = require("../middleware/noauth_middleware")

router.get("/", noAuth, async (req, res) => {
   res.render("index")
})

module.exports = router