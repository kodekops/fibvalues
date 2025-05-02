const express = require("express");
const app = express();

// setup cors
const cors = require("cors");
app.use(cors());

// setup body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const {
  REDIS_HOST,
  REDIS_PORT,
  PG_USER,
  PG_HOST,
  PG_DATABASE,
  PG_PASSWORD,
  PG_PORT,
} = require("./keys");

const redis = require("redis");
const redisClient = redis.createClient({
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
});
const redisPublisher = redisClient.duplicate();

const { Pool } = require("pg");
const pgClient = new Pool({
  user: PG_USER,
  host: PG_HOST,
  database: PG_DATABASE,
  password: PG_PASSWORD,
  port: PG_PORT,
});

// connect the pg client
pgClient.on("connect", (client) => {
  client
    .query("CREATE TABLE IF NOT EXISTS values (number INT)")
    .catch((err) => console.error(err));
});

// connet the redis client
(async () => {
  try {
    await Promise.all([redisClient.connect(), redisPublisher.connect()]);
    console.log("connected to redis and pg server");
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the homepage!",
    data: null,
  });
});

app.get("/values/all", async (req, res) => {
  const values = await pgClient.query("SELECT * from values");
  res.status(200).json({
    success: true,
    message: "Values retrieved successfully",
    data: values.rows,
  });
});

app.get("/values/current", async (req, res) => {
  const values = await redisClient.hGetAll("values");
  res.status(200).json({
    success: true,
    message: "Values retrieved successfully",
    data: values,
  });
});

app.post("/values", async (req, res) => {
  const index = req.body.index;
  if (parseInt(index) > 40) {
    return res.status(422).json({
      success: false,
      message: "Index too high",
      data: null,
    });
  }

  redisClient.hSet("values", index, "Nothing yet!");
  redisPublisher.publish("insert", index);
  pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);

  res.status(201).json({
    success: true,
    message: "Index inserted successfully",
    data: { index },
  });
});

// setup error handler
const errorHandler = require("./middlewares/error_handler");
app.use(errorHandler);

const PORT = 8080;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error: ${err}`);
  server.close(() => process.exit(1));
});
