const bankServiceResponse = require("../services/bank.service");

module.exports = {
  viewBank: async (req, res) => {
    try {
      const adminServiceResponse = await bankServiceResponse.view(req);
      return res.render("admin/bank/viewBank", adminServiceResponse);
    } catch (err) {
      return res.redirect("/admin/bank");
    }
  },
  addBank: async (req, res) => {
    try {
      await bankServiceResponse.add(req);
      return res.redirect("/admin/bank");
    } catch (err) {
      return res.redirect("/admin/bank");
    }
  },
  editBank: async (req, res) => {
    try {
      await bankServiceResponse.edit(req);
      return res.redirect("/admin/bank");
    } catch (error) {
      return res.redirect("/admin/bank");
    }
  },
  deleteBank: async (req, res) => {
    try {
      await bankServiceResponse.delete(req);
      return res.redirect("/admin/bank");
    } catch (error) {
      return res.redirect("/admin/bank");
    }
  },
};
