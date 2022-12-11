const Booking = require("../models/Booking.model");

module.exports = {
  view: async (req) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };
      const title = "Staycation | Detail Item";
      return { title, alert };
    } catch (err) {
      return res.status(err.code).json(err);
    }
  },
};
