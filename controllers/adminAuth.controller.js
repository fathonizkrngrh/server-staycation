const adminAuthServiceResponse = require("../services/adminAuth.service");

module.exports = {
  viewSignIn: async (req, res) => {
    try {
      const adminServiceResponse = await adminAuthServiceResponse.view(req);
      if (req.session.user == null || req.session.user == undefined) {
        return res.render("index", adminServiceResponse);
      } else {
        return res.redirect("/admin/signin");
      }
    } catch (err) {
      return res.redirect("/admin/signin");
    }
  },
  redirect: async (req, res) => {
    try {
      return res.redirect("/admin/signin");
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
};
