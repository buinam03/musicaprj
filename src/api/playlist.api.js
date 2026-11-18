import { get, post, put, del } from './http';

export const getAllPlaylists = () => get('/playlist/getAllPlaylist');

export const getPlaylistById = (id) => get(`/playlist/getPlaylistById/${id}`);

export const getPlaylistsByUser = (userId) => get(`/playlist/getPlaylistsByUserId/${userId}`);

/** Playlist CMS theo thể loại, thứ tự ngẫu nhiên. */
export const getCmsPlaylists = () => get('/playlist/getPlaylistCMS');

export const getAllCmsPlaylists = () => get('/playlist/getAllPlaylistCMS');

export const createPlaylist = ({ name, artwork, creatorId }) =>
    post('/playlist/createNewPlaylist', { name, artwork, creator_id: creatorId });

/** Thêm bài vào playlist có sẵn, hoặc tạo playlist tên tự động nếu không truyền playlistId. */
export const addSongOrCreatePlaylist = ({ playlistId, songId, userId }) =>
    post('/playlist/createNewPlaylistNotName', { playlist_id: playlistId, song_id: songId, user_id: userId });

export const addSongToPlaylist = ({ playlistId, songId }) =>
    post('/playlist/addSongToPlaylist', { playlist_id: playlistId, song_id: songId });

export const removeSongFromPlaylist = ({ playlistId, songId }) =>
    del('/playlist/removeSongFromPlaylist', { playlist_id: playlistId, song_id: songId });

export const updatePlaylist = (id, { name, artwork }) => put(`/playlist/updatePlaylist/${id}`, { name, artwork });

export const deletePlaylist = (id) => del(`/playlist/deletePlaylist/${id}`);
