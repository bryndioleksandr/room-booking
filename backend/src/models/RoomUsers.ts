import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";

interface RoomUserAttributes {
    id: number;
    roomId: number;
    userId: number;
    role: "Admin" | "User";
    createdAt?: Date;
    updatedAt?: Date;
}

interface RoomUserCreationAttributes
    extends Optional<RoomUserAttributes, "id" | "createdAt" | "updatedAt"> {}

class RoomUser
    extends Model<RoomUserAttributes, RoomUserCreationAttributes>
    implements RoomUserAttributes
{
    public id!: number;
    public roomId!: number;
    public userId!: number;
    public role!: "Admin" | "User";
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

RoomUser.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        roomId: { type: DataTypes.INTEGER, allowNull: false },
        userId: { type: DataTypes.INTEGER, allowNull: false },
        role: {
            type: DataTypes.ENUM("Admin", "User"),
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "RoomUser",
        tableName: "room_users",
        timestamps: true,
        indexes: [{ unique: true, fields: ["roomId", "userId"] }],
    }
);

export { RoomUser };
