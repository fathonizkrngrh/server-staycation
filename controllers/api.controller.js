const Item = require("../models/Item.model");
const Category = require("../models/Category.model");
const Traveler = require("../models/Booking.model");
const Treasure = require("../models/Activity.model");
const Bank = require("../models/Bank.model");
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
          // populate item from ItemId
          path: "itemId",
          select: "_id title imageId country city isPopular unit",
          sort: { sumBooking: 1 },
          perDocumentLimit: 4,
          populate: {
            // populate image url from imageId
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

      return res.status(status.OK).json(
        apiResponse(status.OK, "OK", "Welcome to Landing Page", {
          hero: {
            travelers: traveler.length,
            treasures: treasure.length,
            cities: city.length,
          },
          mostPicked,
          categories,
        })
      );
    } catch (e) {
      console.log(e);
      return res
        .status(status.INTERNAL_SERVER_ERROR)
        .json(
          apiResponse(
            e.code || status.INTERNAL_SERVER_ERROR,
            e.status || "INTERNAL_SERVER_ERROR",
            e.message
          )
        );
    }
  },
  detailPage: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id })
        .populate({ path: "imageId", select: "_id imageUrl" })
        .populate({ path: "activityId", select: "_id name type imageUrl" })
        .populate({ path: "facilityId", select: "_id name qty imageUrl" });

      const bank = await Bank.find();
      const testimonial = {
        id,
        name,
        testimoni,
        rate,
      };

      return res.status(status.OK).json(
        apiResponse(status.OK, "OK", "Message", {
          item,
          bank,
          testimonial,
        })
      );
    } catch (e) {
      return res
        .status(status.INTERNAL_SERVER_ERROR)
        .json(
          apiResponse(
            e.code || status.INTERNAL_SERVER_ERROR,
            e.status || "INTERNAL_SERVER_ERROR",
            e.message
          )
        );
    }
  },
  tes: async (req, res) => {
    try {
      return res.status(status.OK).json(
        apiResponse(status.OK, "OK", "Message", {
          data: "data",
        })
      );
    } catch (e) {
      console.log(e);
      return res
        .status(status.INTERNAL_SERVER_ERROR)
        .json(
          apiResponse(
            e.code || status.INTERNAL_SERVER_ERROR,
            e.status || "INTERNAL_SERVER_ERROR",
            e.message
          )
        );
    }
  },
};
