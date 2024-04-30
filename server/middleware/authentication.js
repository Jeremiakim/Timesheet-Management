const { verifyToken } = require("../helpers/jwt");
const { Employee } = require("../models/index");

const authentication = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    // console.log(req.headers, 16);
    if (!authorization) {
      throw {
        name: "Unauthorized",
        message: "You Should Login Firsts",
      };
    }
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer" || !token) {
      throw {
        name: "Invalid Token",
        message: "Invalid Authorization Header Format",
      };
    }
    const dataUser = verifyToken(token);
    const compareUser = await Employee.findOne({
      where: {
        name: dataUser.name,
      },
    });
    if (!compareUser) {
      throw {
        name: `Unauthorized`,
        message: `Login First Please`,
      };
    }
    req.user = {
      id: dataUser.id,
      name: dataUser.name,
      rate: dataUser.rate,
    };
    next();
  } catch (err) {
    console.log(err);
  }
};

module.exports = { authentication };
