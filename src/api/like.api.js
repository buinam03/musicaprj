import { get, post } from './http';

/** @returns {Promise<{ isLiked: boolean }>} */
export const toggleLike = ({ songId, userId }) => post('/like/toggleLike', { song_id: songId, user_id: userId });

/** Id các bài hát user đã like. */
export const getLikedSongIds = async (userId) => {
    const songs = await get('/like/getLikeStatus', { user_id: userId });
    return (songs || []).map((song) => song.id);
};

/** Danh sách lượt like của user, mỗi phần tử có `Song` đầy đủ. */
export const getLikedSongs = (userId) => get('/like/getSongLikeById', { user_id: userId });

/** @returns {Promise<{ song_id: number, likes: number }>} */
export const getSongLikeCount = (songId) => get('/like/getSongLikes', { song_id: songId });
