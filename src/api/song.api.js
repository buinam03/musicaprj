import { get, post, put, del } from './http';

/** Bài hát của một user. */
export const getSongsByUploader = (userId) => get(`/song/getAllSong/${userId}`);

/** Bài hát của user đang đăng nhập. */
export const getMySongs = () => get('/song/getSongByUser');

/** @returns {Promise<{ songs: object[], users: object[] }>} */
export const searchSongs = (key) => get('/song/getSongSearch', { key });

export const getRandomSongs = () => get('/song/getRandomSong');

export const getRecentSongs = () => get('/song/getDESCSong');

/** Bài mới nhất của uploader (mảng 0-1 phần tử). */
export const getLatestSong = (userId) => get(`/song/getLastestSong/${userId}`);

export const getSimilarSongs = ({ songId, userId } = {}) =>
    get('/song/getSimilarSongs', { song_id: songId || undefined, user_id: userId || undefined });

export const getSongById = (id) => get(`/song/getSongById/${id}`);

/** Bài được nghe nhiều nhất của uploader (mảng 0-1 phần tử). */
export const getMostListenedSong = (userId) => get(`/song/getMostListenTrack/${userId}`);

export const getTopSongsByPlays = () => get('/song/getSongByDescPlays');

/** @param {{ title, artwork, genre, bio, duration, privacy, path }} payload */
export const createSong = (payload) => post('/song/addNewSong', payload);

/** @param {{ title, artwork, genre, bio, privacy }} payload */
export const updateSong = (id, payload) => put(`/song/updateSong/${id}`, payload);

export const deleteSong = (id) => del(`/song/deleteSongById/${id}`);

export const logListen = (songId, userId) => post('/song/logUser', { song_id: songId, user_id: userId });

// ---------- song detail ----------

/** Danh sách thể loại [{ id, name, picture, ... }]. */
export const getGenres = () => get('/songdetail/getGenre');

export const increasePlayCount = (songId) => put(`/songdetail/updatePlayWhenListenSong/${songId}`);
