import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  email: string;
  passwordHash?: string; // Only for local accounts
  googleId?: string;
  microsoftId?: string;
  createdAt: Date;
  updatedAt: Date;
}
