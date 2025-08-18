import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/db/mongo';
import { User } from '@/db/user.model';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
  }
  const { db } = await connectToDatabase();
  const existing = await db.collection<User>('users').findOne({ email });
  if (existing) {
    return NextResponse.json({ error: 'User already exists' }, { status: 409 });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const now = new Date();
  const user: User = {
    email,
    passwordHash,
    createdAt: now,
    updatedAt: now,
  };
  await db.collection<User>('users').insertOne(user);
  return NextResponse.json({ success: true });
}
