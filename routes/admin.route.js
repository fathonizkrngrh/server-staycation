const router = require("express").Router();
const adminAuthController = require("../controllers/adminAuth.controller");
const categoryController = require("../controllers/category.controller");
const bankController = require("../controllers/bank.controller");
const itemController = require("../controllers/item.controller");
const bookingController = require("../controllers/booking.controller");
const detailItemController = require("../controllers/detailItem.controller");
const { upload, uploadMultiple } = require("../middleware/multer");
// const auth = require("../middleware/auth").isLoggedin;

// router.use(auth);
router.get("/dashboard", adminAuthController.viewDashboard);

// Endpoint Sign In admin
router.get("/signin", adminAuthController.viewSignIn);
router.post("/signin", adminAuthController.actionSignin);
router.get("/signout", adminAuthController.actionSignout);

// Endpoint Category
router.get("/category", categoryController.viewCategory);
router.post("/category", categoryController.addCategory);
router.put("/category", categoryController.editCategory);
router.delete("/category/:id", categoryController.deleteCategory);

// Endpoint Bank
router.get("/bank", bankController.viewBank);
router.post("/bank", upload, bankController.addBank);
router.put("/bank", upload, bankController.editBank);
router.delete("/bank/:id", bankController.deleteBank);

// Endpoint Item
router.get("/item", itemController.viewItem);
router.post("/item", uploadMultiple, itemController.addItem);
router.get("/item/show-image/:id", itemController.showImageItem);
router.get("/item/:id", itemController.showEditItem);
router.put("/item/:id", uploadMultiple, itemController.editItem);
router.delete("/item/:id/delete", itemController.deleteItem);

// Endpoint Detail Item
router.get(
  "/item/show-detail-item/:itemId",
  detailItemController.viewDetailItem
);
// Facility
router.post("/item/add/facility", upload, detailItemController.addFacility);
router.put(
  "/item/edit-facility/:itemId",
  upload,
  detailItemController.editFacility
);
router.delete(
  "/item/:itemId/facility/:id",
  detailItemController.deleteFacility
);
// Activity
router.post("/item/add/activity", upload, detailItemController.addActivity);
router.put(
  "/item/edit-activity/:itemId",
  upload,
  detailItemController.editActivity
);
router.delete(
  "/item/:itemId/activity/:id",
  detailItemController.deleteActivity
);

router.get("/booking", bookingController.viewBooking);

module.exports = router;
