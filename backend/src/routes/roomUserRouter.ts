import express from "express";
import { addUserToRoom, removeUserFromRoom, listRoomUsers, setRoomUserRole } from "../controllers/RoomUsers";

const roomUserRouter = express.Router();

roomUserRouter.post('/add', addUserToRoom);
roomUserRouter.post('/remove', removeUserFromRoom);
roomUserRouter.get('/:roomId/users', listRoomUsers);
roomUserRouter.post('/role', setRoomUserRole);

export default roomUserRouter;
