const Users = require("../models/Users.model");
const bcrypt = require("bcryptjs");

module.exports = {
  viewSignIn: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };
      const title = "Staycation | Sign In";
      if (req.session.user == null || req.session.user == undefined) {
        return res.render("index", {
          alert,
          title,
        });
      } else {
        return res.redirect("/admin/dashboard");
      }
    } catch (err) {
      res.redirect("/admin/signin");
    }
  },
  actionSignin: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await Users.findOne({ username: username });
      if (!user) {
        req.flash("alertMessage", "username doesn't exist");
        req.flash("alertStatus", "danger");
        return res.redirect("/admin/signin");
      }

      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        req.flash("alertMessage", "password doesn't match");
        req.flash("alertStatus", "danger");
        return res.redirect("/admin/signin");
      }
      return res.redirect("/admin/dashboard");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      return res.redirect("/admin/signin");
    }
  },
  actionSignout: async (req, res) => {
    try {
      req.session.Destroy();
      return res.redirect("/admin/signin");
    } catch (err) {
      return res.redirect("/admin/signin");
    }
  },
};
