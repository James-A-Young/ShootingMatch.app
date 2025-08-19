import { promise, string } from 'zod';
import { UserModel, IUser } from './user.model';
import {IUserPassword, UserPasswordModel} from './userPassword.model'
import { ProtectedPassword } from '@/lib/passwords/types/protectedPassword';
import { connectToDatabase } from './mongo';

export class UserRepository {
    
  async findByEmail(email: string): Promise<IUser | null> {
    await connectToDatabase();
    return UserModel.findOne({ email });
  }

  async createUser(data: Partial<IUser>): Promise<IUser> {
    await connectToDatabase();
    return UserModel.create(data);
  }

  async updateUser(id: string, data: Partial<IUser>): Promise<IUser | null> {
    await connectToDatabase();
    return UserModel.findByIdAndUpdate(id, data, { new: true });
  }
  
  async findUserLocalLogin(email:string) : Promise<{ user: IUser; currentPassword: ProtectedPassword } | null> {
    await connectToDatabase();
    const user = await UserModel.findOne({ email });
    if (!user) return null;

    const currentPassword = await UserPasswordModel.findOne({ userId: user._id });
    if (!currentPassword) return null;
    

    return { user, currentPassword: currentPassword };
  }
  async setPassword(email: String, data: Partial<IUserPassword>): Promise<boolean> {
    await connectToDatabase();
    const user = await UserModel.findOne({ email });
    if (!user) return false;

    //get current password
    const currentPassword = await UserPasswordModel.findOne({ userId: user._id });
    if (!currentPassword) return false; 

    const userPassword = new UserPasswordModel({ ...data, userId: user._id });
    await userPassword.save();
    return true;
  }

}
