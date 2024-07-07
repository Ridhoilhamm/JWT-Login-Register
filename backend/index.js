import express from "express";
import db from "./config/database.js";

import Users from "./models/User.model.js";
import router from "./routes/user.route.js";
const app = express();

try { 
  await db.authenticate;
  console.log("database berhasil terkoneksi");
//   await Users.sync() 
} catch (error) {
    console.error(error)
}
app.use(express.json())
app.use(router)

app.listen(6000, () => console.log("berhasil, runing is port 6000"));
