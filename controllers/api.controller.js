const { StatusCodes: status } = require("http-status-codes");
const {
  apiResponse,
  apiNotFoundResponse,
  apiBadRequestResponse,
} = require("../utils/apiResponse.utils");

module.exports = {
  landingPage: async (req, res) => {
    try {
      const message = "hallo fathoni";
      return apiResponse(status.OK, "OK", "ini landing page", {
        message,
      });
    } catch (err) {
      return res.status(err.code).json(err);
    }
  },
};
