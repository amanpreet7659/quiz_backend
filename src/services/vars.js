require("dotenv").config();

module.exports = {
  env: process.env.NODE_ENV || "development",
  logs: process.env.NODE_ENV === "production" ? "combined" : "dev",
  port: process.env.PORT || 8484,
  mongo: {
    uri:
      process.env.MONGO_URI ||
      "mongodb+srv://node_js_demo:GP1fvZncCa6CvzPJ@cluster0.xps2l.mongodb.net/quiz_app?retryWrites=true&w=majority",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "0123456789",
    expiry: process.env.JWT_EXPIRY || 60 * 24,
  },
};
