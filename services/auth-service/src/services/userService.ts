import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { CreateUserDTO } from 'dto/createUser.dto';
import { UserRepository } from '../repositories/userRepository';

export class UserService {
  private userRepository = new UserRepository();

  async createUser(userData: CreateUserDTO) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password.toString(), salt);

    const newUser = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
      tokenVersion: 0,
    });

    const tokenPayload = {
      id: newUser._id.toString(),
      email: newUser.email,
      tokenVersion: newUser.tokenVersion,
    };
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
      id: user._id.toString(),
      email: user.email,
      tokenVersion: user.tokenVersion,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY, {
      expiresIn: '365d',
    });

    return { user, token };
  }

  async getAllUsers() {
    return await this.userRepository.findAll();
  }

  async getUserById(userId: string) {
    return await this.userRepository.findById(new ObjectId(userId));
  }

  async getUserByEmail(userEmail: string) {
    return await this.userRepository.findByEmail(userEmail);
  }

  async logoutUser(userId: ObjectId): Promise<void> {
    await this.userRepository.logoutUser(userId);
  }
}
