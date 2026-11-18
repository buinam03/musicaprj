import { post } from './http';

/** @returns {Promise<{ accessToken: string, refreshToken: string, userId: number }>} */
export const login = ({ email, password }) => post('/users/login', { email, password });

export const register = ({ username, email, password }) => post('/users/register', { username, email, password });
