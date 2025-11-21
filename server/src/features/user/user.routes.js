import express from "express";
// import * as user from "./user.controller.js";
import { getUser, signupUser, signinUser } from "./user.controller.js";


const router = express.Router();

router.get("/getAll", getUser);
router.post("/signup", signupUser);
router.post("/signin", signinUser);

export default router;
