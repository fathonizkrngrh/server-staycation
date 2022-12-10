const detailItemServiceResponse = require("../services/detailItem.service");

module.exports = {
  viewDetailItem: async (req, res) => {
    const adminServiceResponse = await detailItemServiceResponse.view(req);
    const itemId = await adminServiceResponse.itemId;
    try {
      return res.render(
        "admin/item/detailItem/viewDetailItem",
        adminServiceResponse
      );
    } catch (err) {
      return res.redirect(`admin/item/detailItem/viewDetailItem/${itemId}`);
    }
  },
  addFacility: async (req, res) => {
    const adminServiceResponse = await detailItemServiceResponse.addFacility(
      req
    );
    const itemId = await adminServiceResponse.itemId;
    try {
      return res.render(
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
};
