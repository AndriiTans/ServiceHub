import express from 'express';
import UserController from '../../controllers/userController';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = express.Router();

router.get('/', authMiddleware, UserController.getAllUsers);

router.get('/verify-token', authMiddleware, (req, res) => {
  res.json({ isValid: true, user: req.user });
});

router.post('/verify-token', authMiddleware, (req, res) => {
  res.json({ isValid: true, user: req.user });
});

router.get('/id/:id', UserController.getUserById);

router.get('/email/:email', UserController.getUserByEmail);

router.post('/register', UserController.createUser);

router.post('/login', UserController.loginUser);

router.put('/:id', UserController.updateUser);

router.get('/logout', authMiddleware, UserController.logoutUser);

export default router;
