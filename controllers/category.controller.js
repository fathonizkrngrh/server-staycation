const Category = require("../models/Category.model");
const Item = require("../models/Item.model");
const Image = require("../models/Image.model");
const Facility = require("../models/Facility.model");
const fs = require("fs-extra");
const path = require("path");

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

  viewDetailItem: async (req, res) => {
    const { itemId } = req.params;
    try {
      const facility = await Facility.find({ itemId: itemId });

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };

      res.render("admin/item/detailItem/viewDetailItem", {
        alert,
        itemId,
        facility,
        title: "Staycation | Detail Item",
        action: "view",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`admin/item/detailItem/viewDetailItem/${itemId}`);

      console.log(error);
    }
  },
  addFacility: async (req, res) => {
    const { name, qty, itemId } = req.body;
    try {
      if (!req.file) {
        req.flash("alertMessage", "image not found");
        req.flash("alertStatus", "danger");
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      }

      const facility = await Facility.create({
        name,
        qty,
        itemId,
        imageUrl: `images/${req.file.filename}`,
      });

      const item = await Item.findOne({ _id: itemId });
      item.facilityId.push({ _id: facility._id });
      await item.save();

      req.flash("alertMessage", "success add facility");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },
  editFacility: async (req, res) => {
    try {
      const { id, name, qty } = req.body;
      const facility = await Facility.findOne({ _id: id });

      if (req.file == undefined) {
        facility.facilityName = facilityName;
        facility.rekeningNumber = rekeningNumber;
        facility.userName = userName;

        await facility.save();

        req.flash("alertMessage", `success update facility ${facilityName}`);
        req.flash("alertStatus", "success");
        res.redirect("/admin/facility");
      } else {
        await fs.unlink(path.join(`public/${facility.imageUrl}`));

        facility.facilityName = facilityName;
        facility.rekeningNumber = rekeningNumber;
        facility.userName = userName;
        facility.imageUrl = `images/${req.file.filename}`;

        await facility.save();

        req.flash("alertMessage", "success update facility" + facilityName);
        req.flash("alertStatus", "success");
        res.redirect("/admin/facility");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/facility");
    }
  },
  viewBooking: async (req, res) => {
    res.render("admin/booking/viewBooking", {
      title: "Staycation | Booking",
    });
  },
};
