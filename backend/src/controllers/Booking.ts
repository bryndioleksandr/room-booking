import { Request, Response } from 'express';
import { Booking } from "../models/Booking";
import { MeetingRoom } from "../models/MeetingRoom";
import { User } from "../models/User";
import { BookingParticipant } from "../models/BookingParticipants";

interface BookingWithAssociations extends Booking {
    setUsers?: (users: User[] | number[]) => Promise<void>;
}

export const createBooking = async (req: Request, res: Response) => {
    try {
        const { roomId, createdBy, startTime, endTime, description, participantIds } = req.body as {
            roomId: number;
            createdBy: number;
            startTime: string | Date;
            endTime: string | Date;
            description?: string;
            participantIds?: number[];
        };

        const room = await MeetingRoom.findByPk(roomId);
        if (!room) return res.status(404).json({ msg: "Room not found" });

        const creator = await User.findByPk(createdBy);
        if (!creator) return res.status(404).json({ msg: "Creator user not found" });

        const booking = await Booking.create({
            roomId,
            createdBy,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            description,
        });

        if (participantIds && participantIds.length > 0) {
            const uniqueIds = Array.from(new Set(participantIds));
            const users = await User.findAll({ where: { id: uniqueIds } });
            if (users.length !== uniqueIds.length) {
                return res.status(400).json({ msg: "Some participantIds are invalid" });
            }
            await Promise.all(
                uniqueIds.map((userId) =>
                    BookingParticipant.findOrCreate({
                        where: { bookingId: booking.id, userId },
                        defaults: { bookingId: booking.id, userId },
                    })
                )
            );
        }

        return res.status(201).json(booking);
    } catch (error: any) {
        return res.status(500).json({ msg: error.message });
    }
};

export const getBookings = async (req: Request, res: Response) => {
    try {
        const bookings = await Booking.findAll({
            include: [
                { model: MeetingRoom, as: 'MeetingRoom' },
                { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
                { model: User, through: { attributes: [] }, attributes: ['id', 'name', 'email'] },
            ],
        });
        return res.json(bookings);
    } catch (error: any) {
        return res.status(500).json({ msg: error.message });
    }
};

export const getBookingById = async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.params as { bookingId: string };
        const booking = await Booking.findByPk(bookingId, {
            include: [
                { model: MeetingRoom, as: 'MeetingRoom' },
                { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
                { model: User, through: { attributes: [] }, attributes: ['id', 'name', 'email'] },
            ],
        });
        if (!booking) return res.status(404).json({ msg: "Booking not found" });
        return res.json(booking);
    } catch (error: any) {
        return res.status(500).json({ msg: error.message });
    }
};

export const updateBooking = async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.params as { bookingId: string };
        const { startTime, endTime, description } = req.body as {
            startTime?: string | Date;
            endTime?: string | Date;
            description?: string;
        };

        const booking = await Booking.findByPk(bookingId) as Booking | null;
        if (!booking) return res.status(404).json({ msg: "Booking not found" });

        if (startTime) booking.startTime = new Date(startTime);
        if (endTime) booking.endTime = new Date(endTime);
        if (typeof description !== 'undefined') booking.description = description;

        await booking.save();
        return res.json(booking);
    } catch (error: any) {
        return res.status(500).json({ msg: error.message });
    }
};

export const deleteBooking = async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.params as { bookingId: string };
        const booking = await Booking.findByPk(bookingId);
        if (!booking) return res.status(404).json({ msg: "Booking not found" });
        await booking.destroy();
        return res.json({ msg: "Booking deleted successfully" });
    } catch (error: any) {
        return res.status(500).json({ msg: error.message });
    }
};


