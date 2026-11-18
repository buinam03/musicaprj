import artwork from '@/image/artwork/3107 artwork.jpg';

// Dữ liệu mẫu: trang Insights chưa có API thống kê.

export const MOCK_DAILY_VALUES = [65, 59, 80, 81, 56, 55, 40];

export const MOCK_TRACKS = [
    'Cái đẹp',
    'Ngã tư không đèn',
    'Tình yêu bận bịu',
    'Vùng ký ức',
    'Hành trình cuối',
    'Nhớ mùa thu Hà Nội',
    'Thời thanh xuân đã qua',
    'Hoa nở không màu',
    'Màu nước mắt',
    'Ngày khác lạ',
    'Đi về nhà',
    'Bỏ lỡ một người',
].map((name, index) => ({ id: index + 1, name, image: artwork, plays: 1234 }));

export const PERIOD_OPTIONS = ['Today', 'Last 7 days', 'Last 30 days', 'Last 12 months', 'All time'];

export const METRICS = [
    { title: 'Plays', icon: 'fa-solid fa-play' },
    { title: 'Likes', icon: 'fa-solid fa-heart' },
    { title: 'Comments', icon: 'fa-solid fa-comment' },
];

/** Nhãn "ngày/tháng" của `count` ngày gần nhất, ngày mới nhất ở cuối. */
export const getRecentDayLabels = (count) => {
    const today = new Date();
    return Array.from({ length: count }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() - (count - 1 - i));
        return `${date.getDate()}/${date.getMonth() + 1}`;
    });
};
