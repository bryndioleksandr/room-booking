import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";

interface MeetingRoomAttributes {
    id: number;
    name: string;
    description: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface MeetingRoomCreationAttributes extends Optional<MeetingRoomAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class MeetingRoom extends Model<MeetingRoomAttributes, MeetingRoomCreationAttributes> implements MeetingRoomAttributes {
    public id!: number;
    public name!: string;
    public description!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

MeetingRoom.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'MeetingRoom',
        tableName: 'meeting_rooms',
        timestamps: true,
    }
);

export { MeetingRoom };
