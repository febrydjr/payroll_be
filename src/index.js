const path = require("path");
const authRouter = require("./routes/authRouter");
const salaryRouter = require("./routes/salaryRouter");
const clockRouter = require("./routes/clockRouter");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const express = require("express");
const port = process.env.PORT;
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/salary", salaryRouter);
app.use("/api/clock", clockRouter);

app.listen(port, () => {
  console.log(`API Server is running on port ${port}`);
});
