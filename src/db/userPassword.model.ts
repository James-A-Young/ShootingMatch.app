import { Schema, model, Document } from 'mongoose';

export interface IUserPassword extends Document {
    hash: Buffer;
    salt: Buffer;
    scheme: number;
    createdAt: Date;
}

const UserPasswordSchema = new Schema<IUserPassword>({
    hash: { type: Buffer, required: true },
    salt: { type: Buffer, required: true },
    scheme: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now, required: true }
});

export const UserPasswordModel = model<IUserPassword>('UserPassword', UserPasswordSchema);