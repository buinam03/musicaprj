import { get, post } from './http';

/** @param {'ASC'|'DESC'} order */
export const getComments = (songId, order = 'DESC') => get(`/comment/getAllComment/${songId}`, { time: order });

export const addComment = (songId, { userId, content, parentId = null }) =>
    post(`/comment/addNewCommentToSong/${songId}`, { user_id: userId, content, parent_id: parentId });
