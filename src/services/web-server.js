const http = require("http");

const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");

require("dotenv").config();
const port = process.env.PORT;
const config = require("../config");

global.__basedir = __dirname;

let httpServer;
const maxRequestBodySize = "50mb";

function initialize() {
  return new Promise((resolve, reject) => {
    const app = express();
    httpServer = http.createServer(app);
    app.use(express.json({ limit: maxRequestBodySize }));
    app.use(express.urlencoded({ limit: maxRequestBodySize, extended: true }));
    app.use(morgan("dev"));

    app.use(cookieParser());
    app.use(morgan("combined"));
    app.use(cors(config.corsOptions));
    app.use(express.json({ reviver: reviveJson }));
    // Mount the router at /api so all its routes start with /api
    //app.use("/api/v1", router);

    app.use("/uploads", express.static("uploads"));

    require("../routes")(app);
    httpServer
      .listen(port)
      .on("listening", () => {
        console.log(`Web server listening on localhost:${port}`);

        resolve();
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

module.exports.initialize = initialize;

function close() {
  return new Promise((resolve, reject) => {
    httpServer.close((err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

module.exports.close = close;

const iso8601RegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

function reviveJson(key, value) {
  // revive ISO 8601 date strings to instances of Date
  if (typeof value === "string" && iso8601RegExp.test(value)) {
    return new Date(value);
  } else {
    return value;
  }
}
