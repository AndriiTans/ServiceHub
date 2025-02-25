import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/userService';

const userService = new UserService();

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL, JWT_SECRET_KEY } = process.env;
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL || !JWT_SECRET_KEY) {
  throw new Error('Missing required environment variables for Google OAuth.');
}

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('Google Profile:', profile);

        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error('Google authentication failed: No email found'), null);
        }

        let user = await userService.getUserByEmail(email);

        if (!user) {
          const { user: newUser, token } = await userService.createUser({
            email,
            name: profile.displayName || 'Google User',
            googleId: profile.id || null,
            authMethod: 'google',
          });

          done(null, { user: newUser, token });
        } else {
          const token = jwt.sign(
            { userId: user._id.toString(), email: user.email, tokenVersion: user.tokenVersion },
            JWT_SECRET_KEY,
            { expiresIn: '1h' },
          );

          done(null, { user, token });
        }
      } catch (error) {
        console.error('Google Auth Error:', error);
        done(error, null);
      }
    },
  ),
);

export default passport;
