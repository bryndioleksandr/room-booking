import { Request, Response } from "express";
import { MeetingRoom } from "../models/MeetingRoom";
import { User } from "../models/User";

type ForcedPaymentStatus = "success" | "failed";

interface TestChargeBody {
    roomId: number;
    userId: number;
    startTime: string | Date;
    endTime: string | Date;
    forceStatus?: ForcedPaymentStatus;
}

const PRICE_PER_HOUR = 15;

const randomPaymentStatus = (): ForcedPaymentStatus => {
    return Math.random() < 0.85 ? "success" : "failed";
};

export const testCharge = async (req: Request, res: Response) => {
    try {
        const { roomId, userId, startTime, endTime, forceStatus } = req.body as TestChargeBody;

        if (!roomId || !userId || !startTime || !endTime) {
            return res.status(400).json({ msg: "roomId, userId, startTime and endTime are required" });
        }

        const [room, user] = await Promise.all([
            MeetingRoom.findByPk(roomId),
            User.findByPk(userId),
        ]);

        if (!room) return res.status(404).json({ msg: "Room not found" });
        if (!user) return res.status(404).json({ msg: "User not found" });

        const start = new Date(startTime);
        const end = new Date(endTime);

        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
            return res.status(400).json({ msg: "Invalid startTime or endTime" });
        }

        const durationMs = end.getTime() - start.getTime();
        if (durationMs <= 0) {
            return res.status(400).json({ msg: "endTime must be after startTime" });
        }

        const durationHours = durationMs / (60 * 60 * 1000);
        const amount = Number((durationHours * PRICE_PER_HOUR).toFixed(2));
        const status = forceStatus ?? randomPaymentStatus();

        const transactionId = `test_pay_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

        if (status === "failed") {
            return res.status(402).json({
                msg: "Test payment failed",
                status,
                transactionId,
                amount,
                currency: "USD",
            });
        }

        return res.status(200).json({
            msg: "Test payment successful",
            status,
            transactionId,
            amount,
            currency: "USD",
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return res.status(500).json({ msg: message });
    }
};
