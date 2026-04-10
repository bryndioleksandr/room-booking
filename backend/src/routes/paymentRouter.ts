import express from "express";
import { testCharge } from "../controllers/Payment";

const paymentRouter = express.Router();

paymentRouter.post("/test-charge", testCharge);

export default paymentRouter;
