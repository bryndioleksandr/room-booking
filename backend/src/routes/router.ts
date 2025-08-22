import express from "express";
import userRouter from "./userRouter";
import meetingRoomRouter from "./meetingRoomRouter";
import roomUserRouter from "./roomUserRouter";
import bookingRouter from "./bookingRouter";
import bookingParticipantRouter from "./bookingParticipantRouter";

const router = express.Router();

router.use('/auth', userRouter);
router.use('/rooms', meetingRoomRouter);
router.use('/rooms/users', roomUserRouter);
router.use('/bookings', bookingRouter);
router.use('/booking-participants', bookingParticipantRouter);

export default router;
