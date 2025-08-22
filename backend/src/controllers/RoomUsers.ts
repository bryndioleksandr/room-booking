import { Request, Response } from 'express';
import { MeetingRoom } from "../models/MeetingRoom";
import { User } from "../models/User";
import { RoomUser } from "../models/RoomUsers";

interface MeetingRoomWithUsers extends MeetingRoom {
    addUser: (user: User, options?: any) => Promise<void>;
    removeUser: (user: User, options?: any) => Promise<void>;
    getUsers: () => Promise<User[]>;
}

export const addUserToRoom = async(req: Request, res: Response) => {
    try {
        const {roomId, userId} = req.body;
        const user = await User.findByPk(userId);
        const room = await MeetingRoom.findByPk(roomId) as MeetingRoomWithUsers;
        if (!room) return res.status(404).json({ msg: "Room not found" });
        if (!user) return res.status(404).json({ msg: "User not found" });

        await room.addUser(user, { through: { role: "User" } });
        return res.status(201).json({ msg: "User added to room" });
    }
    catch (error: any) {
        return res.status(500).json({msg: error.message});
    }
}

export const removeUserFromRoom = async(req: Request, res: Response) => {
    try {
        const {roomId, userId} = req.body;
        const user = await User.findByPk(userId);
        const room = await MeetingRoom.findByPk(roomId) as MeetingRoomWithUsers;
        if (!room) return res.status(404).json({ msg: "Room not found" });
        if (!user) return res.status(404).json({ msg: "User not found" });

        await room.removeUser(user);
        return res.json({ msg: "User removed from room" });
    }
    catch (error: any) {
        return res.status(500).json({msg: error.message});
    }
}

export const listRoomUsers = async(req: Request, res: Response) => {
    try {
        const { roomId } = req.params;
        const room = await MeetingRoom.findByPk(roomId) as MeetingRoomWithUsers;
        if (!room) return res.status(404).json({ msg: "Room not found" });

        const users = await room.getUsers();
        return res.json(users.map(u => ({ id: u.id, name: u.name, email: u.email })));
    }
    catch (error: any) {
        return res.status(500).json({msg: error.message});
    }
}

export const setRoomUserRole = async(req: Request, res: Response) => {
    try {
        const { roomId, userId, role } = req.body as { roomId: number; userId: number; role: 'Admin' | 'User' };
        const junction = await RoomUser.findOne({ where: { roomId, userId } });
        if (!junction) return res.status(404).json({ msg: "User not in room" });
        junction.role = role;
        await junction.save();
        return res.json({ msg: "Role updated" });
    }
    catch (error: any) {
        return res.status(500).json({msg: error.message});
    }
}
