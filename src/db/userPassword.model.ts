import mongoose, { Schema, model, Document, ObjectId } from 'mongoose';
export interface IUserPassword extends Document {
    userId: ObjectId;
    hash: Buffer;
    salt: Buffer;
    scheme: number;
    createdAt: Date;
}

const UserPasswordSchema = new Schema<IUserPassword>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    hash: { type: Buffer, required: true },
    salt: { type: Buffer, required: true },
    scheme: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now, required: true }
});

export const UserPasswordModel = mongoose.models.UserPassword || model<IUserPassword>('UserPassword', UserPasswordSchema);