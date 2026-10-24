import { User } from '../models/User.js';

export const findByEmail = (email) => User.findOne({ email });

export const create = (userData) => User.create(userData);
