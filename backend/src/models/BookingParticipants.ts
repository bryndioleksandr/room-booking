import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";

interface BookingParticipantAttributes {
    id: number;
    bookingId: number;
    userId: number;
    createdAt?: Date;
    updatedAt?: Date;
}

interface BookingParticipantCreationAttributes
    extends Optional<BookingParticipantAttributes, "id" | "createdAt" | "updatedAt"> {}

class BookingParticipant
    extends Model<BookingParticipantAttributes, BookingParticipantCreationAttributes>
    implements BookingParticipantAttributes
{
    public id!: number;
    public bookingId!: number;
    public userId!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

BookingParticipant.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        bookingId: { type: DataTypes.INTEGER, allowNull: false },
        userId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
        sequelize,
        modelName: "BookingParticipant",
        tableName: "booking_participants",
        timestamps: true,
        indexes: [{ unique: true, fields: ["bookingId", "userId"] }],
    }
);

export { BookingParticipant };
