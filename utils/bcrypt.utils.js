const bcrypt = require("bcrypt");

module.exports = {
  hashPassword: async (password) => bcrypt.hash(password, 10),
  checkPassword: async (password, userPassword) =>
    bcrypt.compareSync(password, userPassword),
};
