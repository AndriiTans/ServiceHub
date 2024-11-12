import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { UserService } from '../services/userService';
import { CreateUserDTO } from '../dto/createUser.dto';
import { UpdateUserDTO } from '../dto/updateUser.dto';
import { LoginUserDTO } from '../dto/loginUser.dto';

class UserController {
  private userService = new UserService();

  constructor() {
    this.createUser = this.createUser.bind(this);
    this.getAllUsers = this.getAllUsers.bind(this);
    this.loginUser = this.loginUser.bind(this);
    this.logoutUser = this.logoutUser.bind(this);
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

      const userDto = instanceToPlain(user);

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

      const userDto = instanceToPlain(user);

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

      const { user, token } = await this.userService.createUser(req.body);

      // Set the JWT token in an HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600000,
      });

      res.status(201).json({ user, token });
    } catch (error) {
      console.error('Failed to create user:', error);
      res.status(400).json({ message: 'Failed to create user', error });
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userService.getUserById(Number(req.params.id));

      res.status(200).json({ user });
    } catch (error) {
      console.error('Failed to get users:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  }

  async getUserByEmail(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userService.getUserByEmail(req.params.email);

      res.status(200).json({ user });
    } catch (error) {
      console.error('Failed to get users:', error);
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
      res.json(users);
    } catch (error) {
      console.error('Failed to get users:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  }

  async logoutUser(req: Request, res: Response): Promise<void> {
    const userId = req.user.id;
    try {
      await this.userService.logoutUser(userId);

      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Failed to Logged out:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  }
}

export default new UserController();
