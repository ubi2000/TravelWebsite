import express from "express";
import { loginUser, registerUser } from "../controllers/authControllers";
import { authMiddleware } from "../middleswares/authMiddlware";

const router = express.Router();

router.post("/register", registerUser, authMiddleware);
router.post("/login", loginUser, authMiddleware);

export default router;
