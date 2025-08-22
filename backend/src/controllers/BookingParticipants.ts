import { Request, Response } from 'express';
import { BookingParticipant } from "../models/BookingParticipants";
import { Booking } from "../models/Booking";
import { User } from "../models/User";

export const addParticipant = async (req: Request, res: Response) => {
    try {
        const { bookingId, userId } = req.body as { bookingId: number; userId: number };

        const booking = await Booking.findByPk(bookingId);
        if (!booking) return res.status(404).json({ msg: "Booking not found" });

        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ msg: "User not found" });

        const [participant, created] = await BookingParticipant.findOrCreate({
            where: { bookingId, userId },
            defaults: { bookingId, userId },
        });
        if (!created) return res.status(200).json({ msg: "Participant already added" });
        return res.status(201).json(participant);
    } catch (error: any) {
        return res.status(500).json({ msg: error.message });
    }
};

export const removeParticipant = async (req: Request, res: Response) => {
    try {
        const { bookingId, userId } = req.body as { bookingId: number; userId: number };
        const participant = await BookingParticipant.findOne({ where: { bookingId, userId } });
        if (!participant) return res.status(404).json({ msg: "Participant not found in booking" });
        await participant.destroy();
        return res.json({ msg: "Participant removed" });
    } catch (error: any) {
        return res.status(500).json({ msg: error.message });
    }
};

export const listParticipants = async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.params as { bookingId: string };
        const booking = await Booking.findByPk(bookingId) as (Booking & { getUsers?: () => Promise<User[]> }) | null;
        if (!booking) return res.status(404).json({ msg: "Booking not found" });

        if (!booking.getUsers) return res.status(500).json({ msg: "Association getUsers not available on Booking" });
        const users = await booking.getUsers();
        return res.json(users.map(u => ({ id: u.id, name: u.name, email: u.email })));
    } catch (error: any) {
        return res.status(500).json({ msg: error.message });
    }
};


