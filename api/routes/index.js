var express = require("express");
var adminRouter = require("./admin.route");
var apiRouter = require("./api.route");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.redirect("/admin/signin");
});

router.use("/api/v1", apiRouter);
router.use("/admin", adminRouter);

module.exports = router;
