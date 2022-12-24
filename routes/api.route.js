const router = require("express").Router();
const apiController = require("../controllers/api.controller");

router.get("/member/landing-page", apiController.landingPage);

module.exports = router;
