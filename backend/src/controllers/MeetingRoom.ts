import { Request, Response } from 'express';
import { MeetingRoom } from "../models/MeetingRoom";

export const createMeetingRoom = async (req: Request, res: Response) => {
    try{
        const { name, description } = req.body;
        const room = await MeetingRoom.create({
            name,
            description
        });
        return res.status(201).json(room);
    }
    catch (error: any) {
        return res.status(500).json({msg: error.message});
    }
}

export const updateMeetingRoom = async (req: Request, res: Response) => {
    try{
        const { roomId } = req.params;
        const { name, description } = req.body;
        const room = await MeetingRoom.findByPk(roomId);
        if(!room) return res.status(404).json({msg: "Room not found"});
        room.name = name ?? room.name;
        room.description = description ?? room.description;

        await room.save();
        res.json(room);
    }
    catch (error: any) {
        return res.status(500).json({msg: error.message});
    }
}

export const getMeetingRooms = async (req: Request, res: Response) => {
    try {
        const rooms = await MeetingRoom.findAll();
        console.log("rooms are: ", rooms);
        return res.json(rooms);
    } catch (error: any) {
        console.error("Error fetching rooms:", error);
        return res.status(500).json({ msg: error.message || "Server error" });
    }
};

export const getMeetingRoomById = async (req: Request, res: Response) => {
    try {
        const {roomId} = req.params;
        const room = await MeetingRoom.findByPk(roomId);
        if (!room) return res.status(404).json({msg: "Room not found"});
        res.json(room);``
    } catch (error: any) {
        return res.status(500).json({msg: error.message});
    }
}

export const deleteMeetingRoom = async (req: Request, res: Response) => {
    try {
        const {roomId} = req.params;
        const room = await MeetingRoom.findByPk(roomId);
        if (!room) return res.status(404).json({msg: "Room not found"});
        await room.destroy();
        res.json({msg: "Meeting room deleted successfully"});
    }
    catch (error: any) {
        return res.status(500).json({msg: error.message});
    }
}
