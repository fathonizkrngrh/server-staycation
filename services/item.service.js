const Item = require("../models/Item.model");
const Image = require("../models/Image.model");
const Category = require("../models/Category.model");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  view: async (req) => {
    try {
      const item = await Item.find()
        .populate({ path: "imageId", select: "id imageUrl" })
        .populate({ path: "categoryId", select: "id name" });
      const category = await Category.find();
      const image = await Image.find();

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };
      const title = "Staycation | Item";

      return {
        item,
        category,
        image,
        alert,
        title,
        action: "view",
      };
    } catch (error) {
      return res.status(error.code).json(error);
    }
  },
  viewImage: async (req) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id }).populate({
        path: "imageId",
        select: "id imageUrl",
      });

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };
      const title = "Staycation | Show Image Item";

      return {
        item,
        alert,
        title,
        action: "show image",
      };
    } catch (error) {
      return res.status(error.code).json(error);
    }
  },
  add: async (req) => {
    try {
      const { title, price, city, categoryId, description } = req.body;

      if (req.files.length > 0) {
        const category = await Category.findOne({ _id: categoryId });

        const newItem = {
          title,
          price,
          city,
          categoryId: category._id,
          description: description || "Tidak ada deskripsi",
        };
        const item = await Item.create(newItem);
        category.itemId.push({ _id: item._id });
        await category.save();
        console.log(req.files);
        for (let i = 0; i < req.files.length; i++) {
          const imageSave = await Image.create({
            imageUrl: `images/${req.files[i].filename}`,
          });
          item.imageId.push({ _id: imageSave._id });
          await item.save();
        }

        req.flash("alertMessage", "success add item");
        req.flash("alertStatus", "success");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
    }
  },

  showEditItem: async (req) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id })
        .populate({
          path: "imageId",
          select: "id imageUrl",
        })
        .populate({ path: "categoryId", select: "id name" });
      const category = await Category.find();

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };
      const title = "Staycation | Edit Item";

      return {
        item,
        alert,
        category,
        title,
        action: "edit",
      };
    } catch (error) {
      return res.status(error.code).json(error);
    }
  },
  edit: async (req) => {
    try {
      const { id } = req.params;
      const { title, price, city, categoryId, description } = req.body;
      const item = await Item.findOne({ _id: id })
        .populate({
          path: "imageId",
          select: "id imageUrl",
        })
        .populate({ path: "categoryId", select: "id name" });

      if (req.files.length == item.imageId.length) {
        for (let i = 0; i < item.imageId.length; i++) {
          let imageUpdate = await Image.findOne({ _id: item.imageId[i]._id });
          await fs.unlink(path.join(`public/${imageUpdate.imageUrl}`));
          imageUpdate.imageUrl = `images/${req.files[i].filename}`;
          await imageUpdate.save();
        }
        item.title = title;
        item.price = price;
        item.city = city;
        item.categoryId = categoryId;
        item.description = description;
        await item.save();

        req.flash("alertMessage", "success update item");
        req.flash("alertStatus", "success");
      } else if (
        req.files.length != item.imageId.length &&
        req.files.length > 0
      ) {
        for (let i = 0; i < item.imageId.length; i++) {
          let imageUpdate = await Image.findOne({ _id: item.imageId[i]._id });
          await fs.unlink(path.join(`public/${imageUpdate.imageUrl}`));
          item.imageId[i] = undefined;
          await imageUpdate.save();
        }

        for (let j = 0; j < req.files.length; j++) {
          const imageSave = await Image.create({
            imageUrl: `images/${req.files[j].filename}`,
          });
          item.imageId.push({ _id: imageSave._id });
          await item.save();
        }
        item.title = title;
        item.price = price;
        item.city = city;
        item.categoryId = categoryId;
        item.description = description;
        await item.save();

        req.flash("alertMessage", "success update item");
        req.flash("alertStatus", "success");
      } else {
        item.title = title;
        item.price = price;
        item.city = city;
        item.categoryId = categoryId;
        item.description = description;

        await item.save();
        req.flash("alertMessage", "success update item");
        req.flash("alertStatus", "success");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
    }
  },
  delete: async (req) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id }).populate("imageId");
      for (let i = 0; i < item.imageId.length; i++) {
        Image.findOne({ _id: item.imageId[i]._id })
          .then(async (image) => {
            await fs.unlink(path.join(`public/${image.imageUrl}`));
            image.remove();
          })
          .catch((error) => {
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/admin/item");
          });
      }
      await item.remove();
      req.flash("alertMessage", "success delete Item");
      req.flash("alertStatus", "success");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
    }
  },
};
