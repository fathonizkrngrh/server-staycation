const Category = require("../models/Category.model");
const Bank = require("../models/Bank.model");
const Item = require("../models/Item.model");
const Image = require("../models/Image.model");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  viewDashboard: async (req, res) => {
    res.render("admin/dashboard/viewDashboard", {
      title: "Staycation | Dashboard",
    });
  },
  viewCategory: async (req, res) => {
    try {
      const category = await Category.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };

      res.render("admin/category/viewCategory", {
        category,
        alert,
        title: "Staycation | Category",
      });
    } catch (error) {
      res.redirect("/admin/category");
    }
  },
  addCategory: async (req, res) => {
    try {
      const { name } = req.body;
      await Category.create({ name });

      req.flash("alertMessage", "success add category");
      req.flash("alertStatus", "success");
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },
  editCategory: async (req, res) => {
    try {
      const { id, name } = req.body;
      const findCategory = await Category.findOne({ _id: id });

      req.flash("alertMessage", "success update category");
      req.flash("alertStatus", "success");

      findCategory.name = name;

      await findCategory.save();

      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const findCategory = await Category.findOne({ _id: id });

      await findCategory.remove();

      req.flash("alertMessage", "success delete category");
      req.flash("alertStatus", "success");

      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },
  viewBank: async (req, res) => {
    try {
      const bank = await Bank.find();

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };

      res.render("admin/bank/viewBank", {
        title: "Staycation | Bank",
        alert,
        bank,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },
  addBank: async (req, res) => {
    try {
      const { bankName, rekeningNumber, userName } = req.body;
      await Bank.create({
        bankName,
        rekeningNumber,
        userName,
        imageUrl: `images/${req.file.filename}`,
      });

      req.flash("alertMessage", "success add bank");
      req.flash("alertStatus", "success");
      res.redirect("/admin/bank");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },
  editBank: async (req, res) => {
    try {
      const { id, bankName, rekeningNumber, userName } = req.body;
      const bank = await Bank.findOne({ _id: id });

      if (req.file == undefined) {
        bank.bankName = bankName;
        bank.rekeningNumber = rekeningNumber;
        bank.userName = userName;

        await bank.save();

        req.flash("alertMessage", `success update Bank ${bankName}`);
        req.flash("alertStatus", "success");
        res.redirect("/admin/bank");
      } else {
        await fs.unlink(path.join(`public/${bank.imageUrl}`));

        bank.bankName = bankName;
        bank.rekeningNumber = rekeningNumber;
        bank.userName = userName;
        bank.imageUrl = `images/${req.file.filename}`;

        await bank.save();

        req.flash("alertMessage", "success update Bank" + bankName);
        req.flash("alertStatus", "success");
        res.redirect("/admin/bank");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },
  deleteBank: async (req, res) => {
    try {
      const { id } = req.params;
      const bank = await Bank.findOne({ _id: id });
      await fs.unlink(path.join(`public/${bank.imageUrl}`));
      await bank.remove();

      req.flash("alertMessage", "success delete Bank");
      req.flash("alertStatus", "success");

      res.redirect("/admin/bank");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },
  viewItem: async (req, res) => {
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

      res.render("admin/item/viewItem", {
        item,
        category,
        image,
        alert,
        title: "Staycation | Item",
        action: "view",
      });
    } catch (error) {
      res.redirect("admin/item");

      console.log(error);
    }
  },
  showImageItem: async (req, res) => {
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

      res.render("admin/item/viewItem", {
        item,
        alert,
        title: "Staycation | Show Image Item",
        action: "show image",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
      console.log(error);
    }
  },
  addItem: async (req, res) => {
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

        res.redirect("/admin/item");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },
  showEditItem: async (req, res) => {
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

      res.render("admin/item/viewItem", {
        item,
        alert,
        category,
        title: "Staycation | Edit Item",
        action: "edit",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
      console.log(error);
    }
  },
  editItem: async (req, res) => {
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
        res.redirect("/admin/item");
      } else if (req.files.length != item.imageId.length) {
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
        res.redirect("/admin/item");
      } else {
        item.title = title;
        item.price = price;
        item.city = city;
        item.categoryId = categoryId;
        item.description = description;

        await item.save();
        req.flash("alertMessage", "success update item");
        req.flash("alertStatus", "success");
        res.redirect("/admin/item");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
      console.log(error);
    }
  },
  deleteItem: async (req, res) => {
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
      res.redirect("/admin/item");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },
  viewBooking: async (req, res) => {
    res.render("admin/booking/viewBooking", {
      title: "Staycation | Booking",
    });
  },
};
