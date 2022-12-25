const { StatusCodes: status } = require("http-status-codes");
const {
  apiResponse,
  apiNotFoundResponse,
  apiBadRequestResponse,
} = require("./apiResponse.utils");

module.exports = {
  mustComplete: async (formDatas) => {
    for (let i = 0; i < formDatas.length; i++) {
      if (formDatas === undefined || formDatas === "") {
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
    }
  },
};
