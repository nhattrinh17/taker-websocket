export class QueueLeaveRoomDto {
  socketId: string;
  roomName: string;
}
export class QueueJoinRoomDto {
  socketId: string;
  roomName: string;
}

export class QueueHandleJointRoomBEDto {
  userId: string;
}

export class QueueHandleLeaveRoomBEDto {
  userId: string;
}
