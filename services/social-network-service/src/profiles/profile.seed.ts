import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile } from './profile.schema';

@Injectable()
export class ProfileSeedService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
  ) { }

  async getProfileCount() {
    return this.profileModel.countDocuments();
  }

  async seed() {
    const profiles: Partial<Profile>[] = [];

    const mockProfilesNames = [
      'John Doe',
      'Jane Doe',
      'Alice',
      'Bob',
      'Charlie',
      'David',
      'Eve',
      'Frank',
      'Grace',
      'Henry',
    ];

    // Generate profiles using the mock names and hardcoded emails and ages
    for (const name of mockProfilesNames) {
      const profile = {
        name,
        email: `${name.replace(' ', '.').toLowerCase()}@example.com`, // Create email based on the name
        age: Math.floor(Math.random() * (80 - 18 + 1)) + 18, // Random age between 18 and 80
      };

      profiles.push(profile);
    }

    // Insert the profiles into the database
    await this.profileModel.insertMany(profiles);
    console.log('Seeding process completed successfully!');
  }
}
