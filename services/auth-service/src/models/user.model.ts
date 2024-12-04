import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  tokenVersion: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Automatically create `createdAt` and `updatedAt`
  },
);

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
