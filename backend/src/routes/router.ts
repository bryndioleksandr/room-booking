import express from "express";
import userRouter from "./userRouter";
import meetingRoomRouter from "./meetingRoomRouter";
import roomUserRouter from "./roomUserRouter";
import bookingRouter from "./bookingRouter";
import bookingParticipantRouter from "./bookingParticipantRouter";
import paymentRouter from "./paymentRouter";

const router = express.Router();

router.use('/auth', userRouter);
router.use('/rooms', meetingRoomRouter);
router.use('/rooms/users', roomUserRouter);
router.use('/bookings', bookingRouter);
router.use('/booking-participants', bookingParticipantRouter);
router.use('/payments', paymentRouter);

export default router;
