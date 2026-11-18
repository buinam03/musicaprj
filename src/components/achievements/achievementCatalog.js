import followers100k from '@/image/archievements/followers_100k.png';
import plays10k from '@/image/archievements/plays_10k.png';
import plays100k from '@/image/archievements/plays_100k.png';
import plays1m from '@/image/archievements/plays_1m.png';
import plays10m from '@/image/archievements/plays_10m.png';
import top from '@/image/archievements/top.png';
import firstLike from '@/image/archievements/first_like.png';

/** Số huy hiệu tối đa hiển thị trên profile. */
export const MAX_SELECTED = 4;

// Danh sách thành tích (dữ liệu tĩnh, chưa có API).
export const ACHIEVEMENTS = [
    { id: 1, img: followers100k, isCompleted: true, title: 'Reach 100.000 followers' },
    { id: 2, img: plays10k, isCompleted: true, title: 'Reach 10.000 streams' },
    { id: 3, img: plays100k, isCompleted: true, title: 'Reach 100.000 streams' },
    { id: 4, img: plays1m, isCompleted: false, title: 'Reach 1.000.000 streams' },
    { id: 5, img: plays10m, isCompleted: false, title: 'Reach 10.000.000 streams' },
    { id: 6, img: top, isCompleted: true, title: 'Top 1 Musica' },
    { id: 7, img: top, isCompleted: true, title: 'Top 2 Musica' },
    { id: 8, img: top, isCompleted: true, title: 'Top 3 Musica' },
    { id: 9, img: firstLike, isCompleted: true, title: 'Reach top first time!!' },
];
