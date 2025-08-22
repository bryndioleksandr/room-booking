import express from "express";
import { createBooking, getBookings, getBookingById, updateBooking, deleteBooking } from "../controllers/Booking";

const bookingRouter = express.Router();

bookingRouter.post('/', createBooking);
bookingRouter.get('/', getBookings);
bookingRouter.get('/:bookingId', getBookingById);
bookingRouter.put('/:bookingId', updateBooking);
bookingRouter.delete('/:bookingId', deleteBooking);

export default bookingRouter;
