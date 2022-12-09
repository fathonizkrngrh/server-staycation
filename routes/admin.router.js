const router = require("express").Router();
const adminController = require("../controllers/admin.controller");
const { upload, uploadMultiple } = require("../middleware/multer");

router.get("/dashboard", adminController.viewDashboard);
router.get("/", adminController.viewDashboard);

// Endpoint Category
router.get("/category", adminController.viewCategory);
router.post("/category", adminController.addCategory);
router.put("/category", adminController.editCategory);
router.delete("/category/:id", adminController.deleteCategory);

// Endpoint Bank
router.get("/bank", adminController.viewBank);
router.post("/bank", upload, adminController.addBank);
router.put("/bank", upload, adminController.editBank);
router.delete("/bank/:id", adminController.deleteBank);

// Endpoint Item
router.get("/item", adminController.viewItem);
router.post("/item", uploadMultiple, adminController.addItem);
router.get("/item/show-image/:id", adminController.showImageItem);
router.get("/item/:id", adminController.showEditItem);
router.put("/item/:id", uploadMultiple, adminController.editItem);
router.delete("/item/:id/delete", adminController.deleteItem);

// Endpoint Detail Item
router.get("/item/show-detail-item/:itemId", adminController.viewDetailItem);
router.post("/item/add/facility", upload, adminController.addFacility);
router.put("/item/edit-facility/:itemId", upload, adminController.editFacility);

router.get("/booking", adminController.viewBooking);

module.exports = router;
