import jwt from "jsonwebtoken";

module.exports = {
  findToken: (req) => {
    const token = req.header("auth-token");

    if (!token || token === undefined) {
      return false;
    }
    return token;
  },
  signToken: (params, time = 1) => {
    return jwt.sign(params, process.env.TOKEN_SECRET, {
      expiresIn: 60 * 60 * 24 * time,
    });
  },
  verifyToken: (token) => {
    return jwt.verify(token, process.env.TOKEN_SECRET);
  },
};
