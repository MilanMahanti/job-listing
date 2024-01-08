const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

process.on("uncaughtException", (err) => {
  console.log("UNCCAUGHT EXCEPTION! SHUTTING DOWN....");
  console.log(err.name, err.message);
  process.exit(1);
});

const DB = process.env.DATABASE_URL.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => console.log("DB connection successfull"))
  .catch((err) => console.log(err));

const app = require("./index");
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server running on port: ${port}`));

process.on("unhandledRejection", (err) => {
  console.log("UNHANDELED REJECTION! SHUTTING DOWN....");
  console.log(err);
  process.exit(1);
});
