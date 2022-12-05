module.exports = {
  viewDashboard: (req, res) => {
    res.render("admin/dashboard/viewDashboard");
  },
  viewCategory: (req, res) => {
    res.render("admin/category/viewCategory");
  },
  viewBank: (req, res) => {
    res.render("admin/bank/viewBank");
  },
  viewItem: (req, res) => {
    res.render("admin/item/viewItem");
  },
  viewBooking: (req, res) => {
    res.render("admin/booking/viewBooking");
  },
};
