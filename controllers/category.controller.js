const Category = require("../models/Category.model");
const Image = require("../models/Image.model");

const categoryServicesResponse = require("../services/category.service");

module.exports = {
  viewDashboard: async (req, res) => {
    res.render("admin/dashboard/viewDashboard", {
      title: "Staycation | Dashboard",
    });
  },
  viewCategory: async (req, res) => {
    try {
      const adminServiceResponse = await categoryServicesResponse.view(req);
      return res.render("admin/category/viewCategory", adminServiceResponse);
    } catch (err) {
      return res.redirect("/admin/category");
    }
  },
  addCategory: async (req, res) => {
    try {
      const adminServiceResponse = await categoryServicesResponse.add(req);
      return res.redirect("/admin/category", adminServiceResponse);
    } catch (err) {
      return res.redirect("/admin/category");
    }
  },
  editCategory: async (req, res) => {
    try {
      const adminServiceResponse = await categoryServicesResponse.edit(req);
      return res.redirect("/admin/category", adminServiceResponse);
    } catch (error) {
      return res.redirect("/admin/category");
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const adminServiceResponse = await categoryServicesResponse.delete(req);
      return res.redirect("/admin/category", adminServiceResponse);
    } catch (error) {
      return res.redirect("/admin/category");
    }
  },
};
