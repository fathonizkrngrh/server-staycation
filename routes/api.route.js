const router = require("express").Router();
const apiController = require("../controllers/api.controller");

router.get("/member/home", apiController.landingPage);
router.get("/member/detail/:id", apiController.detailPage);

module.exports = router;
