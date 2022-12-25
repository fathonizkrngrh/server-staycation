const Item = require("../models/Item.model");
const Category = require("../models/Category.model");
const Traveler = require("../models/Booking.model");
const Treasure = require("../models/Activity.model");
const Bank = require("../models/Bank.model");
const Booking = require("../models/Booking.model");
const Member = require("../models/Member.model");
// utilities
const { StatusCodes: status } = require("http-status-codes");
const {
  apiResponse,
  apiNotFoundResponse,
  apiBadRequestResponse,
} = require("../utils/apiResponse.utils");
const { countDuration, createInvoice } = require("../utils/booking.utils");

module.exports = {
  landing: async (req, res) => {
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
  detail: async (req, res) => {
    try {
      const { itemId } = req.params;
      const item = await Item.findOne({ _id: itemId })
        .populate({ path: "imageId", select: "_id imageUrl" })
        .populate({ path: "activityId", select: "_id name type imageUrl" })
        .populate({ path: "facilityId", select: "_id name qty imageUrl" });

      const bank = await Bank.find();
      const testimonial = {
        id: "id",
        name: "username",
        testimoni: "testimoni",
        rate: "stars",
        itemId: "itemId",
      };

      return res.status(status.OK).json(
        apiResponse(status.OK, "OK", "Message", {
          ...item._doc,
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
  booking: async (req, res) => {
    try {
      const {
        bookingStartDate,
        bookingEndDate,
        firstName,
        lastName,
        email,
        phoneNumber,
        accountHolder,
        bankFrom,
      } = req.body;
      const { itemId } = req.params;

      // cek kelengkapan semua form
      if (
        bookingStartDate === "" ||
        bookingEndDate === "" ||
        firstName === "" ||
        lastName === "" ||
        email === "" ||
        phoneNumber === "" ||
        accountHolder === "" ||
        bankFrom === ""
      ) {
        return res
          .status(status.NOT_ACCEPTABLE)
          .json(
            apiResponse(
              status.NOT_ACCEPTABLE,
              "NOT ACCEPTABLE",
              "Complete All Form !!",
              null
            )
          );
      }

      // cek apakah item ada di database
      const item = await Item.findOne({ _id: itemId });
      if (!item) {
        return res
          .status(status.NOT_FOUND)
          .json(apiNotFoundResponse("Hotel or Villa Not Found"));
      }

      // menghitung durasi
      const duration = await countDuration(bookingStartDate, bookingEndDate);
      if (duration === 0 || duration === "") {
        return res
          .status(status.NOT_ACCEPTABLE)
          .json(
            apiResponse(
              status.NOT_ACCEPTABLE,
              "NOT ACCEPTABLE",
              "Minimum Duration is 1 Day",
              null
            )
          );
      }

      // cek apakah ada file bukti pembayaran yang dikirim
      if (!req.file) {
        return res
          .status(status.NOT_ACCEPTABLE)
          .json(
            apiResponse(
              status.NOT_ACCEPTABLE,
              "NOT ACCEPTABLE",
              "Proof payment required",
              null
            )
          );
      }

      // menghitung harga dari item
      const pricePerDay = item.price;
      const tax = 0.1;
      const price = pricePerDay * duration;
      const total = price + price * tax;

      // buat invoice
      const invoice = await createInvoice(item.title, total, duration);

      // menambah jumlah booking item
      item.sumBooking += 1;
      await item.save();

      // membuat member baru
      let member = await Member.findOne({ email });
      const newMember = {
        firstName,
        lastName,
        email,
        phoneNumber,
      };
      if (!member) {
        await Member.create(newMember);
        member = newMember;
      }

      const newBooking = {
        invoice,
        bookingStartDate,
        bookingEndDate,
        total,
        itemId: {
          _id: item.id,
          title: item.title,
          price: item.price,
          duration: duration,
        },
        memberId: member.id,
        payments: {
          proofPayment: `images/${req.file.filename}`,
          bankFrom,
          accountHolder,
        },
      };

      // membuat booking baru di database
      const booking = await Booking.create(newBooking);

      return res.status(status.OK).json(
        apiResponse(status.OK, "OK", "Sucess Booking", {
          ...booking._doc,
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
