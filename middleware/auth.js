module.exports = {
  isLoggedin: async (req, res, next) => {
    if (req.session.user === null || req.session.user === undefined) {
      req.flash("alertMessag=e", "session expired, please login again");
      req.flash("alertStatus", "warning");
      res.redirect("/admin/dashboard");
    }
    next();
  },
};
