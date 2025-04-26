import { ObjectId } from 'mongodb';
import User, { IUser } from '../models/user.model';

export class UserRepository {
  async create(userData: Partial<IUser>): Promise<IUser> {
    try {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const user = new User(userData);

      return await user.save();
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async getUserWithPasswordByEmail(email: string): Promise<IUser | null> {
    try {
      return await User.findOne({ email }).select('+password');
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  // Find user by ID
  async findById(id: ObjectId): Promise<IUser | null> {
    try {
      return await User.findById(id);
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<IUser | null> {
    try {
      return await User.findOne({ email });
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  async findAll(): Promise<IUser[]> {
    try {
      return await User.find();
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  }

  async logoutUser(userId: ObjectId): Promise<void> {
    try {
      const user = await this.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      user.tokenVersion += 1;
      await user.save();
    } catch (error) {
      console.error('Error logging out user:', error);
      throw error;
    }
  }
}
