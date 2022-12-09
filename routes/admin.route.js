const router = require("express").Router();
const categoryController = require("../controllers/category.controller");
const bankController = require("../controllers/bank.controller");
const itemController = require("../controllers/item.controller");
const { upload, uploadMultiple } = require("../middleware/multer");

router.get("/dashboard", categoryController.viewDashboard);
router.get("/", categoryController.viewDashboard);

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
router.get("/item/show-detail-item/:itemId", categoryController.viewDetailItem);
router.post("/item/add/facility", upload, categoryController.addFacility);
router.put(
  "/item/edit-facility/:itemId",
  upload,
  categoryController.editFacility
);

router.get("/booking", categoryController.viewBooking);

module.exports = router;