const router = require("express").Router();
const apiController = require("../controllers/api.controller");
const { upload } = require("../middleware/multer");

router.get("/member/home", apiController.landing);
router.get("/member/:itemId/detail", apiController.detail);
router.post("/member/:itemId/booking", upload, apiController.booking);

module.exports = router;
