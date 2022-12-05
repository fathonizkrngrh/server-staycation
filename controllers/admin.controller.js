const Category = require("../models/Category.model");
const Bank = require("../models/Bank.model");

module.exports = {
  viewDashboard: (req, res) => {
    res.render("admin/dashboard/viewDashboard", {
      title: "Staycation | Dashboard",
    });
  },
  viewCategory: async (req, res) => {
    try {
      const category = await Category.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };

      console.log(category);
      res.render("admin/category/viewCategory", {
        category,
        alert,
        title: "Staycation | Category",
      });
    } catch (error) {
      res.redirect("/admin/category");
    }
  },
  addCategory: async (req, res) => {
    try {
      const { name } = req.body;
      await Category.create({ name });

      req.flash("alertMessage", "success add category");
      req.flash("alertStatus", "success");
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },
  editCategory: async (req, res) => {
    try {
      const { id, name } = req.body;
      const findCategory = await Category.findOne({ _id: id });

      req.flash("alertMessage", "success update category");
      req.flash("alertStatus", "success");

      findCategory.name = name;

      await findCategory.save();

      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const findCategory = await Category.findOne({ _id: id });

      await findCategory.remove();

      req.flash("alertMessage", "success delete category");
      req.flash("alertStatus", "success");

      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },
  viewBank: (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };

      res.render("admin/bank/viewBank", {
        title: "Staycation | Bank",
        alert,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },
  addBank: async (req, res) => {
    try {
      const { bankName, rekeningNumber, userName } = req.body;
      console.log(req.file);
      await Bank.create({
        bankName,
        rekeningNumber,
        userName,
        imageUrl: `images/${req.file.filename}`,
      });

      req.flash("alertMessage", "success add bank");
      req.flash("alertStatus", "success");
      res.redirect("/admin/bank");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },
  viewItem: (req, res) => {
    res.render("admin/item/viewItem", {
      title: "Staycation | Item",
    });
  },
  viewBooking: (req, res) => {
    res.render("admin/booking/viewBooking", {
      title: "Staycation | Booking",
    });
  },
};
