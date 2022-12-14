const Bank = require("../models/Bank.model");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  viewBank: async (req, res) => {
    try {
      const bank = await Bank.find();

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };
      const title = "Staycation | Bank";
      res.render("admin/bank/viewBank", {
        bank,
        alert,
        title,
      });
    } catch (err) {
      res.redirect("/admin/bank");
    }
  },
  addBank: async (req, res) => {
    try {
      const { bankName, rekeningNumber, userName } = req.body;
      await Bank.create({
        bankName,
        rekeningNumber,
        userName,
        imageUrl: `images/${req.file.filename}`,
      });

      req.flash("alertMessage", "Success add bank");
      req.flash("alertStatus", "success");
      res.redirect("/admin/bank");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },
  editBank: async (req, res) => {
    try {
      const { id, bankName, rekeningNumber, userName } = req.body;
      const bank = await Bank.findOne({ _id: id });

      if (req.file == undefined) {
        bank.bankName = bankName;
        bank.rekeningNumber = rekeningNumber;
        bank.userName = userName;

        await bank.save();

        req.flash("alertMessage", `success update Bank ${bankName}`);
        req.flash("alertStatus", "success");
      } else {
        await fs.unlink(path.join(`public/${bank.imageUrl}`));

        bank.bankName = bankName;
        bank.rekeningNumber = rekeningNumber;
        bank.userName = userName;
        bank.imageUrl = `images/${req.file.filename}`;

        await bank.save();

        req.flash("alertMessage", "Success update Bank" + bankName);
        req.flash("alertStatus", "success");
      }
      res.redirect("/admin/bank");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },
  deleteBank: async (req, res) => {
    try {
      const { id } = req.params;
      const bank = await Bank.findOne({ _id: id });
      await fs.unlink(path.join(`public/${bank.imageUrl}`));
      await bank.remove();

      req.flash("alertMessage", "Success delete bank " + bank.bankName);
      req.flash("alertStatus", "success");
      res.redirect("/admin/bank");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },
};
