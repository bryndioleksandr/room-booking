import { User } from "./User";
import { MeetingRoom } from "./MeetingRoom";
import { RoomUser } from "./RoomUsers";
import { Booking } from "./Booking";
import { BookingParticipant } from "./BookingParticipants";

MeetingRoom.belongsToMany(User, {
    through: RoomUser,
    foreignKey: "roomId",
    otherKey: "userId",
});
User.belongsToMany(MeetingRoom, {
    through: RoomUser,
    foreignKey: "userId",
    otherKey: "roomId",
});

MeetingRoom.hasMany(Booking, { foreignKey: "roomId" });
Booking.belongsTo(MeetingRoom, { foreignKey: "roomId" });

User.hasMany(Booking, { foreignKey: "createdBy" });
Booking.belongsTo(User, { as: "creator", foreignKey: "createdBy" });

Booking.belongsToMany(User, {
    through: BookingParticipant,
    foreignKey: "bookingId",
    otherKey: "userId",
});
User.belongsToMany(Booking, {
    through: BookingParticipant,
    foreignKey: "userId",
    otherKey: "bookingId",
});
