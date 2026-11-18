import { get, put } from './http';

export const getCurrentUser = () => get('/users/getCurrentUser');

export const getUserById = (id) => get(`/users/getUserById/${id}`);

/** User ngẫu nhiên (kèm followerCount). */
export const getRandomUsers = () => get('/users/getRandomUser');

export const getProvinces = () => get('/users/getProvince');

export const updateProfilePicture = (profilePicture) => put('/users/updateProfilePicture', { profilePicture });

export const updateHeaderPicture = (headerpicture) => put('/users/updateHeaderPicture', { headerpicture });

export const updateUserInfo = ({ username, province, country, bio }) =>
    put('/users/updateUserInfo', { username, province, country, bio });
