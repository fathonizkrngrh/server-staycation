const Users = require("../models/Users.model");
const bcrypt = require("bcryptjs");

module.exports = {
  view: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };
      const title = "Staycation | Sign In";
      return { alert, title };
    } catch (error) {
      return res.status(error.code).json(error);
    }
  },
  signin: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await Users.findOne({ username: username });
      if (!user) {
        req.flash("alertMessage", "username doesn't exist");
        req.flash("alertStatus", "danger");
        res.redirect("/admin/signin");
      }

      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        req.flash("alertMessage", "password doesn't match");
        req.flash("alertStatus", "danger");
        res.redirect("/admin/signin");
      }
      return res.redirect("/admin/dashboard");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
    }
  },
  signout: async (req) => {
    req.session.Destroy();
  },
};
