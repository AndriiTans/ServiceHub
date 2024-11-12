import { AppDataSource } from '../config/database';
import { IUser, User } from '../models/user.model';

export class UserRepository {
  private userRepository = AppDataSource.getRepository(User);

  async create(userData: Partial<IUser>): Promise<User> {
    try {
      const existingUser = await this.userRepository.findOneBy({ email: userData.email });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const user = this.userRepository.create(userData);
      await this.userRepository.save(user);

      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async getUserWithPasswordByEmail(email: string): Promise<IUser | null> {
    try {
      return await this.userRepository.findOne({
        where: { email },
        select: ['id', 'email', 'password', 'name', 'tokenVersion'],
      });
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  async findById(id: number): Promise<IUser | null> {
    try {
      return await this.userRepository.findOne({ where: { id } });
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<IUser | null> {
    try {
      return await this.userRepository.findOne({ where: { email } });
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  async findAll(): Promise<IUser[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  }

  async logoutUser(userId: number): Promise<void> {
    try {
      await this.userRepository.increment({ id: userId }, 'tokenVersion', 1);
    } catch (error) {
      console.error('Error logout:', error);
      throw error;
    }
  }
}
