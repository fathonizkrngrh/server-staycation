const detailItemServiceResponse = require("../services/detailItem.service");

module.exports = {
  viewDetailItem: async (req, res) => {
    const adminServiceResponse = await detailItemServiceResponse.view(req);
    console.log(adminServiceResponse);
    const { itemId } = req.params;
    console.log(itemId);
    try {
      return res.render(
        "admin/item/detailItem/viewDetailItem",
        adminServiceResponse
      );
    } catch (err) {
      console.log(err);
      return res.redirect(`admin/item/detailItem/viewDetailItem/${itemId}`);
    }
  },
  addFacility: async (req, res) => {
    const adminServiceResponse = await detailItemServiceResponse.addFacility(
      req
    );
    const itemId = await adminServiceResponse.itemId;
    try {
      return res.redirect(
        `/admin/item/show-detail-item/${itemId}`,
        adminServiceResponse
      );
    } catch (err) {
      return res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },
  editFacility: async (req, res) => {
    try {
      await detailItemServiceResponse.editFacility(req);
      return res.redirect("/admin/facility");
    } catch (err) {
      return res.redirect("/admin/facility");
    }
  },
  deleteFacility: async (req, res) => {
    const { itemId } = req.params;
    try {
      const adminServiceResponse =
        await detailItemServiceResponse.deleteFacility(req);
      return res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (err) {
      return res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  // Activity

  addActivity: async (req, res) => {
    const { itemId } = req.body;
    console.log(itemId);
    try {
      await detailItemServiceResponse.addActivity(req);
      return res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (err) {
      return res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },
  editActivity: async (req, res) => {
    try {
      await detailItemServiceResponse.editActivity(req);
      return res.redirect("/admin/Activity");
    } catch (err) {
      return res.redirect("/admin/Activity");
    }
  },
  deleteActivity: async (req, res) => {
    const { itemId } = req.params;
    try {
      const adminServiceResponse =
        await detailItemServiceResponse.deleteActivity(req);
      return res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (err) {
      console.log(err);
      return res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },
};
