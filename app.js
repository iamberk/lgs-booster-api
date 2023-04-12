const express = require("express");
require("express-async-errors");
require("dotenv").config();
require("./src/db/dbConnection");
const app = express();
const port = process.env.PORT || 5001;
const errorHandlerMiddleware = require("./src/middlewares/errorHandler");
const cors = require("cors");
const path = require("path");
const apiLimiter = require("./src/middlewares/rateLimit");
const corsOptions = require("./src/helpers/corsOptions");
const moment = require("moment-timezone");
moment.tz.setDefault("Europe/Istanbul");
const mongoSanitize = require("express-mongo-sanitize");
const { swaggerDocs: V1SwaggerDocs } = require("./swagger");

//Middlewares
app.use(express.json());
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);



app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(__dirname));

app.use(cors(corsOptions));

app.use("/api", apiLimiter);

app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);

const router = require("./src/v1/routers/index");
app.use("/api", router);

app.get("/", (req, res) => {
  res.send({ message: "Hello From Express" });
});

// Error Handler
app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log("##########################################################");
  console.log("#####               STARTING SERVER                  #####");
  console.log("##########################################################\n");
  console.log(`server running on → PORT ${port}`);
  V1SwaggerDocs(app, port);
});

process.on("uncaughtException", (error) => {
  console.log(`uncaught exception: ${error.message}`);
  process.exit(1);
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error ${err.message}`);
  server.close(() => process.exit(1));
});