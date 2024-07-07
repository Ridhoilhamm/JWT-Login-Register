import express from "express";
import dotenv from "dotenv";
import { getUsers, Register, Login } from "../controllers/User.controller.js";
import { VerifyToken } from "../middleware/VerifayToken.js";
dotenv.config();
const router = express.Router();

router.get("/users", VerifyToken, getUsers);
router.post("/users", Register);
router.post("/login", Login);

export default router;
