const Item = require("../models/Item.model");
const Category = require("../models/Category.model");
const Traveler = require("../models/Booking.model");
const Treasure = require("../models/Activity.model");
const fs = require("fs-extra");
const path = require("path");
const { StatusCodes: status } = require("http-status-codes");
const {
  apiResponse,
  apiNotFoundResponse,
  apiBadRequestResponse,
} = require("../utils/apiResponse.utils");

module.exports = {
  landingPage: async (req, res) => {
    try {
      const mostPicked = await Item.find()
        .select("_id title imageId country city price unit")
        .limit(5)
        .populate({ path: "imageId", select: "_id imageUrl" });

      const categories = await Category.find()
        .select("_id name")
        .limit(3)
        .populate({
          path: "itemId",
          select: "_id title imageId country city isPopular unit",
          sort: { sumBooking: 1 },
          perDocumentLimit: 4,
          populate: {
            path: "imageId",
            select: "_id imageUrl",
            perDocumentLimit: 1,
          },
        });

      // check popular
      for (let i = 0; i < categories.length; i++) {
        for (let j = 0; j < categories[i].itemId.length; j++) {
          const item = await Item.findOne({ _id: categories[i].itemId[j]._id });
          item.isPopular = false;
          await item.save();
          if (
            categories[i].itemId[categories[i].itemId.length - 1] ===
            categories[i].itemId[j]
          ) {
            item.isPopular = true;
            await item.save();
          }
        }
      }

      const traveler = await Traveler.find();
      const treasure = await Treasure.find();
      const city = await Item.find();
      //   return apiResponse(status.OK, "OK", "ini landing page", {
      //     message,
      //   });
      return res.status(200).json({
        hero: {
          travelers: traveler.length,
          treasures: treasure.length,
          cities: city.length,
        },
        mostPicked,
        categories,
      });
    } catch (e) {
      console.log(e);
      throw apiResponse(
        e.code || status.INTERNAL_SERVER_ERROR,
        e.status || "INTERNAL_SERVER_ERROR",
        e.message
      );
    }
  },
};
