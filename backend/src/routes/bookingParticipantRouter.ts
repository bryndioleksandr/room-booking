import express from "express";
import { addParticipant, removeParticipant, listParticipants } from "../controllers/BookingParticipants";

const bookingParticipantRouter = express.Router();

bookingParticipantRouter.post('/', addParticipant);
bookingParticipantRouter.delete('/', removeParticipant);
bookingParticipantRouter.get('/:bookingId/participants', listParticipants);

export default bookingParticipantRouter;
