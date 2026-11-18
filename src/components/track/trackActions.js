import { Modal, notification } from 'ant-design-vue';
import { songApi, getErrorMessage } from '@/api';

/** Xoá bài hát (không hỏi lại). @returns {Promise<boolean>} true nếu xoá thành công */
export const deleteTrack = async (songId) => {
    try {
        await songApi.deleteSong(songId);
        notification.success({
            message: 'Track Deleted',
            description: 'Track has been deleted successfully.',
            duration: 3,
        });
        return true;
    } catch (error) {
        console.error('Error deleting track:', error);
        notification.error({
            message: 'Delete Failed',
            description: getErrorMessage(error, 'Failed to delete track. Please try again later.'),
            duration: 4,
        });
        return false;
    }
};

/**
 * Hỏi xác nhận rồi xoá bài hát.
 * @returns {Promise<boolean>} true nếu đã xoá, false nếu huỷ hoặc lỗi
 */
export const confirmDeleteTrack = (songId) =>
    new Promise((resolve) => {
        Modal.confirm({
            title: 'Delete Track',
            content: 'Are you sure you want to delete this track? This action cannot be undone.',
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            centered: true,
            onOk: async () => resolve(await deleteTrack(songId)),
            onCancel: () => resolve(false),
        });
    });
