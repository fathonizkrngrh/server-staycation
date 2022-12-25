const session = require("express-session");
module.exports = {
  isLoggedin: async (req, res, next) => {
    console.log(" SESSION ", req.session.user);
    if (req.session.user == null || req.session.user == undefined) {
      console.log(" SESSION ", req.session.user);
      req.flash("alertMessag=e", "session expired, please login again");
      req.flash("alertStatus", "warning");
      res.redirect("/admin/signin");
    }
    next();
  },
};
