import * as usersDao from '../dao/users.dao.js';

export const getByEmail = (email) => usersDao.findByEmail(email);

export const createUser = (userData) => usersDao.create(userData);
