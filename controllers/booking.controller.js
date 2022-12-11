const bookingServicesResponse = require("../services/booking.service");

module.exports = {
  viewBooking: async (req, res) => {
    try {
      const adminServiceResponse = await bookingServicesResponse.view(req);
      return res.render("admin/booking/viewBooking", adminServiceResponse);
    } catch (err) {
      return res.redirect("/admin/booking");
    }
  },
};
