import { Injectable } from '@nestjs/common';
import { Profile } from './profile.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProfilesService {
  constructor(@InjectModel(Profile.name) private profileModel: Model<Profile>) { }

  async create(user: Partial<Profile>): Promise<Profile> {
    const newUser = new this.profileModel(user);
    return newUser.save();
  }

  async findAll(): Promise<Profile[]> {
    return this.profileModel.find().exec();
  }

  async findOne(id: string): Promise<Profile> {
    return this.profileModel.findById(id).exec();
  }

  async update(id: string, user: Partial<Profile>): Promise<Profile> {
    return this.profileModel.findByIdAndUpdate(id, user, { new: true }).exec();
  }

  async delete(id: string): Promise<Profile> {
    return this.profileModel.findByIdAndDelete(id).exec();
  }
}