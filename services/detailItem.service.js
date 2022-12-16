const Item = require("../models/Item.model");
const Facility = require("../models/Facility.model");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  view: async (req) => {
    const { itemId } = req.params;
    try {
      const facility = await Facility.find({ itemId: itemId });

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };
      const title = "Staycation | Detail Item";

      return {
        alert,
        itemId,
        facility,
        title,
        action: "view",
      };
    } catch (error) {
      return res.status(error.code).json(error);
    }
  },
  addFacility: async (req) => {
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

      return { itemId };
    } catch (error) {
      return res.status(error.code).json(error);
    }
  },
  editFacility: async (req) => {
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
      } else {
        await fs.unlink(path.join(`public/${facility.imageUrl}`));

        facility.facilityName = facilityName;
        facility.rekeningNumber = rekeningNumber;
        facility.userName = userName;
        facility.imageUrl = `images/${req.file.filename}`;

        await facility.save();

        req.flash("alertMessage", "success update facility" + facilityName);
        req.flash("alertStatus", "success");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
    }
  },
  deleteFacility: async (req) => {
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
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
    }
  },
};
