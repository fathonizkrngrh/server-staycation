const Item = require("../models/Item.model");
const Facility = require("../models/Facility.model");
const Activity = require("../models/Activity.model");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  viewDetailItem: async (req, res) => {
    const { itemId } = req.params;
    try {
      const facility = await Facility.find({ itemId: itemId });
      const activity = await Activity.find({ itemId: itemId });

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };
      const title = "Staycation | Detail Item";

      res.render("admin/item/detailItem/viewDetailItem", {
        alert,
        itemId,
        facility,
        activity,
        title,
        action: "view",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`admin/item/detailItem/viewDetailItem/${itemId}`);
    }
  },
  addFacility: async (req, res) => {
    const { name, qty, itemId } = req.body;
    try {
      if (!req.file) {
        req.flash("alertMessage", "image not found");
        req.flash("alertStatus", "danger");
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
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },
  editFacility: async (req, res) => {
    const { itemId } = req.params;
    try {
      const { id, name, qty } = req.body;
      const facility = await Facility.findOne({ _id: id });

      if (req.file == undefined) {
        facility.name = name;
        facility.qty = qty;

        await facility.save();

        req.flash("alertMessage", `success update facility ${name}`);
        req.flash("alertStatus", "success");
      } else {
        await fs.unlink(path.join(`public/${facility.imageUrl}`));

        facility.name = name;
        facility.qty = qty;
        facility.imageUrl = `images/${req.file.filename}`;

        await facility.save();

        req.flash("alertMessage", "success update facility" + name);
        req.flash("alertStatus", "success");
      }
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },
  deleteFacility: async (req, res) => {
    const { id, itemId } = req.params;
    try {
      const facility = await Facility.findOne({ _id: id });
      const item = await Item.findOne({ _id: itemId }).populate("facilityId");
      for (let i = 0; i < item.facilityId.length; i++) {
        if (item.facilityId[i]._id.toString() === facility._id.toString()) {
          item.facilityId.pull({ _id: facility._id });
          await item.save();
        }
      }

      await fs.unlink(path.join(`public/${facility.imageUrl}`));
      await facility.remove();

      req.flash("alertMessage", "Success delete facility ");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  // Activity

  addActivity: async (req, res) => {
    const { name, type, itemId } = req.body;
    try {
      if (!req.file) {
        req.flash("alertMessage", "image not found");
        req.flash("alertStatus", "danger");
      }

      const activity = await Activity.create({
        name,
        type,
        itemId,
        imageUrl: `images/${req.file.filename}`,
      });

      const item = await Item.findOne({ _id: itemId });
      item.activityId.push({ _id: activity._id });
      await item.save();

      req.flash("alertMessage", "success add activity");
      req.flash("alertStatus", "success");

      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },
  editActivity: async (req, res) => {
    try {
      const { id, name, type } = req.body;
      const activity = await Activity.findOne({ _id: id });

      if (req.file == undefined) {
        activity.name = name;
        activity.type = type;

        await activity.save();

        req.flash("alertMessage", `success update activity ${name}`);
        req.flash("alertStatus", "success");
      } else {
        await fs.unlink(path.join(`public/${activity.imageUrl}`));

        activity.name = name;
        activity.type = type;
        activity.imageUrl = `images/${req.file.filename}`;

        await activity.save();

        req.flash("alertMessage", "success update activity" + name);
        req.flash("alertStatus", "success");
      }
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },
  deleteActivity: async (req, res) => {
    const { id, itemId } = req.params;
    try {
      const activity = await Activity.findOne({ _id: id });
      const item = await Item.findOne({ _id: itemId }).populate("activityId");
      for (let i = 0; i < item.activityId.length; i++) {
        if (item.activityId[i]._id.toString() === activity._id.toString()) {
          item.activityId.pull({ _id: activity._id });
          await item.save();
        }
      }

      await fs.unlink(path.join(`public/${activity.imageUrl}`));
      await activity.remove();
      req.flash("alertMessage", "Success delete activity ");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },
};
