const Category = require("../models/Category.model");

module.exports = {
  view: async (req) => {
    try {
      const category = await Category.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };
      const title = "Staycation | Category";

      return { category, alert, title };
    } catch (error) {
      return res.status(error.code).json(error);
    }
  },
  add: async (req) => {
    try {
      const { name } = req.body;
      await Category.create({ name });

      req.flash("alertMessage", "success add category");
      req.flash("alertStatus", "success");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
    }
  },
  edit: async (req) => {
    try {
      const { id, name } = req.body;
      const findCategory = await Category.findOne({ _id: id });

      findCategory.name = name;

      await findCategory.save();

      req.flash("alertMessage", "success edit category");
      req.flash("alertStatus", "success");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
    }
  },
  delete: async (req) => {
    try {
      const { id } = req.params;
      const findCategory = await Category.findOne({ _id: id });

      await findCategory.remove();

      req.flash("alertMessage", "success delete category");
      req.flash("alertStatus", "success");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
    }
  },
};
