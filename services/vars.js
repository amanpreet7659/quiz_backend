require("dotenv").config();

module.exports = {
  env: process.env.NODE_ENV || "development",
  logs: process.env.NODE_ENV === "production" ? "combined" : "dev",
  port: process.env.PORT || 4000,
  mongo: {
    uri: process.env.MONGO_URI || "mongodb://localhost:27017",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "0123456789",
    expiry: process.env.JWT_EXPIRY || 60 * 24,
  },
};
