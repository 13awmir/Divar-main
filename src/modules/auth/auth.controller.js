const CookieNames = require("../../common/constant/cookie.enum");
const { AuthMessage } = require("./auth.messages");
const authService = require("./auth.service");
const autoBind = require("auto-bind");
class AuthController {
  #service;
  constructor() {
    autoBind(this);
    this.#service = authService;
  }
  async sendOTP(req, res, next) {
    try {
      const { mobile } = req.body;
      await this.#service.sendOTP(mobile);
      return res.json({
        message: AuthMessage.SendOtpSuccessfully,
      });
    } catch (error) {
      next(error);
    }
  }
  async checkOTP(req, res, next) {
    try {
      const { mobile, code } = req.body;
      const token = await this.#service.checkOTP(mobile, code);
      return res
        .cookie(CookieNames.AccessToken, token, {
          httpOnly: true,
          secure: false,
        })
        .status(200)
        .json({
          message: AuthMessage.loginSuccessfully,
          token,
        });
    } catch (error) {
      next(error);
    }
  }
  async logOut(req, res, next) {
    try {
      return res.clearCookie(CookieNames.AccessToken).json({
        message: "logged out successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
