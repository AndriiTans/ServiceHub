import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { instanceToPlain, plainToClass, plainToInstance } from 'class-transformer';
import { UserService } from '../services/userService';
import { CreateUserDTO } from '../dto/createUser.dto';
import { LoginUserDTO } from '../dto/loginUser.dto';
import { UpdateUserDTO } from '../dto/updateUser.dto';
import { UserResponseDto } from '../dto/user-response.dto';

class UserController {
  private userService = new UserService();

  constructor() {
    this.createUser = this.createUser.bind(this);
    this.getAllUsers = this.getAllUsers.bind(this);
    this.loginUser = this.loginUser.bind(this);
    this.logoutUser = this.logoutUser.bind(this);
    this.getUserById = this.getUserById.bind(this);
    this.getUserByEmail = this.getUserByEmail.bind(this);
  }

  async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const loginUserDTO = plainToClass(LoginUserDTO, req.body);

      const errors = await validate(loginUserDTO);
      if (errors.length > 0) {
        res.status(400).json({ message: 'Validation failed', errors });
        return;
      }

      const { email, password } = loginUserDTO;
      const { user, token } = await this.userService.loginUser(email, password);

      const userDto = plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true });

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000,
      });

      res.status(200).json({ user: userDto, token });
    } catch (error) {
      console.error('Failed to log in:', error);
      res.status(401).json({ message: 'Invalid credentials', error });
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const createUserDTO = plainToClass(CreateUserDTO, req.body);

      const errors = await validate(createUserDTO);

      if (errors.length > 0) {
        res.status(400).json({ message: 'Validation failed', errors });
        return;
      }

      const { user, token } = await this.userService.createUser(req.body);

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600000,
      });

      const userDto = plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true });

      res.status(201).json({ user: userDto, token });
    } catch (error) {
      console.error('Failed to create user:', error);
      res.status(400).json({ message: 'Failed to create user', error });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const updateUserDTO = plainToClass(UpdateUserDTO, req.body);

      const errors = await validate(updateUserDTO);

      if (errors.length > 0) {
        res.status(400).json({ message: 'Validation failed', errors });
        return;
      }

      // const updatedUser = await this.userService.updateUser(req.user._id, req.body);

      // res.status(200).json({ user: instanceToPlain(updatedUser) });
      res.status(200).json({ user: null });
    } catch (error) {
      console.error('Failed to update user:', error);
      res.status(400).json({ message: 'Failed to update user', error });
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userService.getUserById(req.params.id);

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res
        .status(200)
        .json({ user: plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true }) });
    } catch (error) {
      console.error('Failed to get user by ID:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  }

  async getUserByEmail(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userService.getUserByEmail(req.params.email);

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res
        .status(200)
        .json({ user: plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true }) });
    } catch (error) {
      console.error('Failed to get user by email:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();

      if (!users || users.length === 0) {
        res.status(404).json({ message: 'No users found' });
        return;
      }

      res
        .status(200)
        .json(plainToInstance(UserResponseDto, users, { excludeExtraneousValues: true }));
    } catch (error) {
      console.error('Failed to get users:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  }

  async logoutUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user._id;
      await this.userService.logoutUser(userId);

      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Failed to log out:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  }
}

export default new UserController();
