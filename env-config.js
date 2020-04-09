const ENV_PATH =
  process.env.NODE_ENV === "production" ? "./.env" : "./.env.development";

require("dotenv").config({ path: ENV_PATH });

module.exports = {
  "process.env.GA_ID": process.env.GA_ID
};
