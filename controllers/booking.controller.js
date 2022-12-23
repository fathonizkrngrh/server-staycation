const Booking = require("../models/Booking.model");
const Member = require("../models/Member.model");
const Bank = require("../models/Bank.model");

module.exports = {
  viewBooking: async (req, res) => {
    try {
      const booking = await Booking.find()
        .populate("memberId")
        .populate("bankId");
      console.log(booking);
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };
      const title = "Staycation | Booking";
      res.render("admin/booking/viewBooking", {
        title,
        alert,
        booking,
      });
    } catch (err) {
      res.redirect("/admin/booking");
    }
  },
};
