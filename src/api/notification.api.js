import { get } from './http';

export const getNotifications = () => get('/notification/getAllNotification');
