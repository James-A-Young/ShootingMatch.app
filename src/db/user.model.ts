
import mongoose,{ Schema, model, Document } from 'mongoose';

export interface IUser extends Document{
  email: string;
  displayName: string;
  placeOfBirth: string;
  dateOfBirth: Date;
  address: string;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, trim: true },
  displayName: { type: String, required: false, trim: true },
  placeOfBirth: { type: String, required: false },
  dateOfBirth: { type: Date, required: false },
  address: { type: String, required: false },
  updatedAt: { type: Date, required: true, default: Date.now }
});

export const UserModel = mongoose.models.User || model<IUser>('User', UserSchema);
