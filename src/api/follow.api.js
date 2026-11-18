import http, { get } from './http';

/**
 * Follow / unfollow (server tự toggle).
 * @returns {Promise<{ followed: boolean, following: object[] }>}
 */
export const toggleFollow = async (followingId) => {
    const res = await http.post('/follow/addNewFollower', { following_id: followingId });
    return { followed: res.status === 201, following: res.data.data };
};

/** Quan hệ follow của user hiện tại với userId (null nếu chưa follow). */
export const getFollowRelation = (userId) => get(`/follow/getFollowerById/${userId}`);

/** Followers của một hoặc nhiều user. */
export const getFollowers = (userIds) =>
    get('/follow/getAllFollower', { ids: [].concat(userIds).join(',') });

/** Danh sách user mà userId đang follow (mỗi item có `following` kèm `isFollow`). */
export const getFollowing = (userId) => get('/follow/getAllFollowing', { id: userId });

export const countFollowers = (userId) => get('/follow/getCountFollower', { id: userId });

export const countFollowing = (userId) => get('/follow/getCountFollowing', { id: userId });

export const searchFollowers = (userId, username) => get('/follow/searchFollowers', { id: userId, username });

export const searchFollowing = (userId, username) => get('/follow/searchFollowing', { id: userId, username });

/**
 * Followers của userId kèm cờ:
 * - isFollowing: userId có follow lại họ không
 * - isFollowed : user hiện tại có follow họ không
 */
export const getFollowerStatusList = (userId) => get('/follow/getFollowStatus', { user_id: userId });
