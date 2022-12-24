const Member = require("../models/Member.model");
const Booking = require("../models/Booking.model");
const Item = require("../models/Item.model");

module.exports = {
  viewDashboard: async (req, res) => {
    try {
      const member = await Member.find();
      const booking = await Booking.find();
      const item = await Item.find();

      res.render("admin/dashboard/viewDashboard", {
        title: "Staycation | Dashboard",
        member,
        booking,
        item,
      });
    } catch (err) {
      res.redirect("/admin/dashboard");
    }
  },
};
