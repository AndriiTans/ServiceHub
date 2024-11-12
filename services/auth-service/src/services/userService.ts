import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/userRepository';
import { IUser } from '../models/user.model';

export class UserService {
  private userRepository = new UserRepository();

  async createUser(userData: Partial<IUser>) {
    const salt = await bcrypt.genSalt(10);
    console.log('salt');
    const hashedPassword = await bcrypt.hash(userData.password.toString(), salt);
    console.log('hashedPassword', hashedPassword);

    const newUser = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    const tokenPayload = {
      id: newUser.id,
      email: newUser.email,
      tokenVersion: newUser.tokenVersion,
    };

    console.log('newUser.tokenVersion ', newUser.tokenVersion);

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY, {
      expiresIn: '365d',
    });

    return { user: newUser, token };
  }

  async loginUser(email: string, password: string) {
    const user = await this.userRepository.getUserWithPasswordByEmail(email);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      tokenVersion: user.tokenVersion,
    };

    console.log('.process.env.JWT_SECRET_KEY ', process.env.JWT_SECRET_KEY);

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY, {
      expiresIn: '365d',
    });

    return { user, token };
  }

  async getAllUsers() {
    return await this.userRepository.findAll();
  }

  async getUserById(userId: number) {
    return await this.userRepository.findById(userId);
  }

  async getUserByEmail(userEmail: string) {
    return await this.userRepository.findByEmail(userEmail);
  }

  async logoutUser(userId: number): Promise<void> {
    await this.userRepository.logoutUser(userId);
  }
}
