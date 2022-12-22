const adminAuthServiceResponse = require("../services/adminAuth.service");

module.exports = {
  viewDashboard: async (req, res) => {
    console.log(req.session);
    res.render("admin/dashboard/viewDashboard", {
      title: "Staycation | Dashboard",
      user: req.session.user,
    });
  },
  viewSignIn: async (req, res) => {
    try {
      const adminServiceResponse = await adminAuthServiceResponse.view(req);
      if (req.session.user == null || req.session.user == undefined) {
        return res.render("index", adminServiceResponse);
      } else {
        return res.redirect("/admin/dashboard");
      }
    } catch (err) {
      return res.redirect("/admin/signin");
    }
  },
  redirect: async (req, res) => {
    try {
      const adminServiceResponse = await adminAuthServiceResponse.view(req);
      if (req.session.user == null || req.session.user == undefined) {
        return res.render("index", adminServiceResponse);
      } else {
        return res.redirect("/admin/dashboard");
      }
    } catch (err) {
      return res.redirect("/admin/signin");
    }
  },
  actionSignin: async (req, res) => {
    try {
      await adminAuthServiceResponse.signin(req, res);
    } catch (err) {
      return res.redirect("/admin/signin");
    }
  },
  actionSignout: async (req, res) => {
    try {
      await adminAuthServiceResponse.signout(req);
      return res.redirect("/admin/signin");
    } catch (err) {
      return res.redirect("/admin/signin");
    }
  },
};
