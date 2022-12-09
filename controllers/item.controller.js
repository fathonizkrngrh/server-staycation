const itemServiceResponse = require("../services/item.service");

module.exports = {
  viewItem: async (req, res) => {
    try {
      const adminServiceResponse = await itemServiceResponse.view(req);
      return res.render("admin/item/viewItem", adminServiceResponse);
    } catch (err) {
      return res.redirect("/admin/item");
    }
  },
  showImageItem: async (req, res) => {
    try {
      const adminServiceResponse = await itemServiceResponse.viewImage(req);
      return res.render("admin/item/viewItem", adminServiceResponse);
    } catch (err) {
      return res.redirect("/admin/item");
    }
  },
  addItem: async (req, res) => {
    try {
      await itemServiceResponse.add(req);
      return res.redirect("/admin/item");
    } catch (err) {
      return res.redirect("/admin/item");
    }
  },
  showEditItem: async (req, res) => {
    try {
      const adminServiceResponse = await itemServiceResponse.showEditItem(req);
      return res.render("admin/item/viewItem", adminServiceResponse);
    } catch (err) {
      return res.redirect("/admin/item");
    }
  },
  editItem: async (req, res) => {
    try {
      await itemServiceResponse.edit(req);
      return res.redirect("/admin/item");
    } catch (error) {
      return res.redirect("/admin/item");
    }
  },
  deleteItem: async (req, res) => {
    try {
      await itemServiceResponse.delete(req);
      return res.redirect("/admin/item");
    } catch (error) {
      return res.redirect("/admin/item");
    }
  },
};
