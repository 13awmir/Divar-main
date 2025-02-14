require("dotenv").config();
const { default: axios } = require("axios");
const getAddressDetail = async (lat, lng) => {
  const result = await axios
    .get(`${process.env.MAP_IR_URL}?lat=${lat}&lon=${lng}`, {
      headers: {
        "x-api-key": process.env.MAP_IR_API,
      },
    })
    .then((res) => res.data);
  return {
    province: result.province,
    city: result.city,
    district: result.district,
    address: result.address,
  };
};

module.exports = {
  getAddressDetail,
};
