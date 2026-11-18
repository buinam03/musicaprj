/**
 * Lấy thông tin nghệ sĩ từ các dạng response khác nhau của API.
 * @returns {{ id: number|null, name: string }}
 */
export const getSongArtist = (song) => {
    if (!song) return { id: null, name: 'Unknown Artist' };
    if (song.User?.username) return { id: song.User.id ?? song.uploader_id ?? null, name: song.User.username };
    const artistUser = song.SongArtists?.[0]?.User;
    if (artistUser?.username) return { id: artistUser.id ?? null, name: artistUser.username };
    if (song.username) return { id: song.uploader_id ?? null, name: song.username };
    return { id: null, name: 'Unknown Artist' };
};
