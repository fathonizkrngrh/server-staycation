var express = require("express");
var adminRouter = require("./admin.route");
var usersRouter = require("./user.route");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.use("/users", usersRouter);
router.use("/admin", adminRouter);

module.exports = router;
