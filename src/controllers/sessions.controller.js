import * as sessionsService from '../services/sessions.service.js';
import { AppError } from '../utils/AppError.js';

const notImplemented = (req, res) => {
  res.status(501).json({ status: 'error', message: 'No implementado todavía' });
};

export const register = async (req, res) => {
  try {
    const user = await sessionsService.register(req.body ?? {});
    res.status(201).json({ status: 'success', payload: user });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.status).json({ status: 'error', message: error.message });
    }
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

export const login = notImplemented;
export const current = notImplemented;
