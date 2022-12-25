const jwt = require("jsonwebtoken");

module.exports = {
  generateToken: (user) => {
    const payload = {
      id: user.id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      role: user.role?.name,
    };

    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });
  },
  verifyToken: (token) => jwt.verify(token, process.env.JWT_SECRET_KEY),
};
