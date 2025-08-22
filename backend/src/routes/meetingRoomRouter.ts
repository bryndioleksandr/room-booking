import express from "express";
import { createMeetingRoom, updateMeetingRoom, getMeetingRooms, getMeetingRoomById, deleteMeetingRoom } from "../controllers/MeetingRoom";

const meetingRoomRouter = express.Router();

meetingRoomRouter.post('/', createMeetingRoom);
meetingRoomRouter.get('/', getMeetingRooms);
meetingRoomRouter.get('/:roomId', getMeetingRoomById);
meetingRoomRouter.put('/:roomId', updateMeetingRoom);
meetingRoomRouter.delete('/:roomId', deleteMeetingRoom);

export default meetingRoomRouter;
