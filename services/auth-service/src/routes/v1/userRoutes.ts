import express from 'express';
import UserController from '../../controllers/userController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import passport from '../../auth/googleAuth';

const router = express.Router();

router.get('/', authMiddleware, UserController.getAllUsers);

// Initiate Google login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    if (!req.user) {
      console.error('Google OAuth failed: No user found');
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const { user, token } = req.user as { user: any; token: string };

    console.log('Google OAuth Success:', user.email);

    return res.status(200).json({ user, token });
    // res.redirect(`http://localhost:3001?token=${token}`);
  },
);

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
