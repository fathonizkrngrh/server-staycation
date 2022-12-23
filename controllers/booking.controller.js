const Booking = require("../models/Booking.model");
const Member = require("../models/Member.model");
const Bank = require("../models/Bank.model");

module.exports = {
  viewBooking: async (req, res) => {
    try {
      const booking = await Booking.find()
        .populate("memberId")
        .populate("bankId");
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
  showDetailBooking: async (req, res) => {
    try {
      const { id } = req.params;
      const booking = await Booking.findOne({ _id: id })
        .populate("memberId")
        .populate("bankId");
      console.log(" BOOKING ", booking.payments.proofPayment);

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };
      const title = "Staycation | Show Detail Booking";
      res.render("admin/booking/showDetailBooking", {
        title,
        alert,
        booking,
      });
    } catch (err) {
      console.log(err);
      res.redirect("/admin/booking");
    }
  },
  confirmBooking: async (req, res) => {
    const { id } = req.params;
    try {
      const booking = await Booking.findOne({ _id: id });
      booking.payments.status = "Accepted";
      await booking.save();

      req.flash("alertMessage", "Booking accepted");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/booking/${id}`);
    } catch (err) {
      console.log(err);
      res.redirect(`/admin/booking/${id}`);
    }
  },
  rejectBooking: async (req, res) => {
    const { id } = req.params;
    try {
      const booking = await Booking.findOne({ _id: id });
      booking.payments.status = "Rejected";
      await booking.save();

      req.flash("alertMessage", "Booking rejected successfull");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/booking/${id}`);
    } catch (err) {
      console.log(err);
      res.redirect(`/admin/booking/${id}`);
    }
  },
};
