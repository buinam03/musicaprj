import { onMounted, onBeforeUnmount, unref } from 'vue';

/**
 * Gọi handler khi click ra ngoài phần tử (hoặc danh sách phần tử).
 * @param {import('vue').Ref<HTMLElement|null> | Array} targets
 * @param {(event: MouseEvent) => void} handler
 */
export function useClickOutside(targets, handler) {
    const listener = (event) => {
        const elements = [].concat(targets).map(unref).filter(Boolean);
        if (elements.some((el) => el.contains(event.target))) return;
        handler(event);
    };

    onMounted(() => document.addEventListener('click', listener));
    onBeforeUnmount(() => document.removeEventListener('click', listener));
}
