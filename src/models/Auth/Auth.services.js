const AuthRepositories = require("./Auth.repositories");
const bcryptServices = require("../../utils/bcrypt");
const AppError = require("../../utils/AppError");
const jwtServices = require("../../utils/jwt");
const bcryptSevices = require("../../utils/bcrypt");

const AuthServices = {
  register: async (payloads) => {
    const data = payloads;
    if (!data.email) throw new Error("Email is not defined");
    if (!data.name) throw new Error("Name is not defined");
    if (!data.password) throw new Error("Password is not defined");

    const existed = await AuthRepositories.findbyemail(data.email);

    if (existed) throw new Error("Email is already existed");

    const hashedpassword = await bcryptServices.hashPassword(data.password);
    if (!hashedpassword) throw new Error("Password is not hashed");

    const user = await AuthRepositories.createuser(
      data.name,
      data.email,
      hashedpassword
    );
    if (!user) throw new Error("user is not created");

    return {
      message: "User Registered successfully",
    };
  },

  login: async (payloads) => {
    if (!payloads.email) throw new AppError("email is required", 400);
    if (!payloads.password) throw new AppError("password is required", 400);

    const user = await AuthRepositories.findbyemail(payloads.email);
    if (!user) throw new AppError("User not found", 404);

    const is_verified = await bcryptServices.comparePassword(
      payloads.password,
      user.password
    );
    if (!is_verified) throw new AppError("Password not matched", 403);

    const data = { id: user.id, name: user.name };
    const AccessToken = await jwtServices.generateAccessToken(data);
    if (!AccessToken) throw new AppError("Access token is not generated", 400);

    const RefreshToken = await jwtServices.generateRefreshToken(data);
    if (!RefreshToken)
      throw new AppError("Refresh token is not generated", 400);

    const hashRefreshToken = await bcryptServices.hashToken(RefreshToken);
    const savetoken = await AuthRepositories.updateRefreshToken(
      hashRefreshToken,
      user.id
    );
    if (savetoken === 0) throw new AppError("Token is not saved");

    return {
      name: user.name,
      AccessToken: AccessToken,
      RefreshToken: RefreshToken,
    };
  },

  logout: async (RefreshToken) => {
    const refreshToken = RefreshToken;
    if (!refreshToken) throw new AppError("RefreshToken not found", 400);
    const decode = await jwtServices.decodeRefreshToken(refreshToken);
    if (!decode) throw new AppError("Decode does not work");
    const user = await AuthRepositories.findbyid(decode.id);
    if (!user) throw new AppError("User does not exist", 400);
    const is_verified = await bcryptSevices.compareToken(
      refreshToken,
      user.refreshtoken
    );
    if (!is_verified) throw new AppError("Permission denied", 403);
    const updatetoken = await AuthRepositories.updateRefreshToken(
      null,
      user.id
    );
    if (updatetoken === 0) throw new AppError("token is not updated");
    return {
      message: "done",
    };
  },

  refresh: async (refreshToken) => {
    const Token = refreshToken;
    if (!Token) throw new AppError("Token not recieved", 400);
    const decode = jwtServices.decodeRefreshToken(refreshToken);
    if (!decode) throw new AppError("token doesn't  decrypt");
    const user = await AuthRepositories.findbyid(decode.id);
    if (!user) throw new AppError("User not found", 400);
    const is_verified = await bcryptSevices.compareToken(
      refreshToken,
      user.refreshtoken
    );
    if (!is_verified) throw new AppError("Permission Denied", 403);
    const data = { id: user.id, name: user.name };
    const newAccessToken = await jwtServices.generateAccessToken(data);
    if (!newAccessToken)
      throw new AppError("New Access Token is not generated", 404);
    const newRefreshToken = await jwtServices.generateRefreshToken(data);
    if (!newRefreshToken)
      throw new AppError("New Refresh Token is not generated", 404);
    const hashedtoken = await bcryptServices.hashToken(newRefreshToken);
    if (!hashedtoken)
      throw new AppError("New Refresh Token is not hashed", 400);
    const updatetoken = await AuthRepositories.updateRefreshToken(
      hashedtoken,
      user.id
    );
    if (!updatetoken) throw new AppError("Token is not updated", 400);
    return {
      accessToken: newAccessToken,
      RefreshToken: newRefreshToken,
    };
  },
};

module.exports = AuthServices;
