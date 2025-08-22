import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";

interface BookingAttributes {
    id: number;
    roomId: number;
    createdBy: number;
    startTime: Date;
    endTime: Date;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface BookingCreationAttributes
    extends Optional<BookingAttributes, "id" | "description" | "createdAt" | "updatedAt"> {}

class Booking
    extends Model<BookingAttributes, BookingCreationAttributes>
    implements BookingAttributes
{
    public id!: number;
    public roomId!: number;
    public createdBy!: number;
    public startTime!: Date;
    public endTime!: Date;
    public description?: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Booking.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        roomId: { type: DataTypes.INTEGER, allowNull: false },
        createdBy: { type: DataTypes.INTEGER, allowNull: false },
        startTime: { type: DataTypes.DATE, allowNull: false },
        endTime: { type: DataTypes.DATE, allowNull: false },
        description: { type: DataTypes.STRING, allowNull: true },
    },
    {
        sequelize,
        modelName: "Booking",
        tableName: "bookings",
        timestamps: true,
    }
);

export { Booking };
