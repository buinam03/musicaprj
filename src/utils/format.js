import { formatDistanceToNow } from 'date-fns';

/** 185 -> "3:05" (giây -> phút:giây). */
export const formatDuration = (seconds) => {
    const value = Number(seconds);
    if (!value || Number.isNaN(value)) return '0:00';
    const rounded = Math.round(value);
    const min = Math.floor(rounded / 60);
    const sec = rounded % 60;
    return `${min}:${String(sec).padStart(2, '0')}`;
};

/** ISO date -> "05/03/2025". */
export const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}/${date.getFullYear()}`;
};

/** ISO date -> "14:05". */
export const formatClock = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

/** ISO date -> "3 minutes ago". */
export const timeAgo = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return formatDistanceToNow(date, { addSuffix: true });
};

/** 1 -> "1 follower", 2 -> "2 followers". */
export const pluralize = (count, word) => `${count} ${word}${Number(count) === 1 ? '' : 's'}`;
