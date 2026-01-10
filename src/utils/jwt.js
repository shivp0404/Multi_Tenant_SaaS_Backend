const jwt = require("jsonwebtoken");

const jwtServices = {
  generateAccessToken: (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "30m",
    });
  },

  generateRefreshToken: (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1hr",
    });
  },

  decodeRefreshToken:(RefreshToken)=>{
    return jwt.verify(RefreshToken,process.env.REFRESH_TOKEN_SECRET)
  }
};

module.exports = jwtServices;
