import { get, post } from './http';

/** Phòng chat của user hiện tại: [{ room_id, latest_message, latest_message_time, partner }]. */
export const getRooms = () => get('/message/getAllRoomsByUser');

export const getRoomMessages = (roomId) => get(`/message/getRoomMessage/${roomId}`);

/** Tin nhắn đầu tiên user hiện tại đã gửi (dùng để mở phòng chat gần nhất). */
export const getFirstSentMessage = () => get('/message/getASCRoom');

export const sendMessage = ({ roomId, message }) => post('/message/sendMessage', { room_id: roomId, message });
