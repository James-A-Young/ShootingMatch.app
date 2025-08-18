
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/db/mongo';
import { User } from '@/db/user.model';
import bcrypt from 'bcryptjs';
import { createSession } from '../session';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
  }
  const { db } = await connectToDatabase();
  const user = await db.collection<User>('users').findOne({ email });
  // Use a constant-time dummy hash if user not found
  // This is a bcrypt hash for the password 'invalid-password'
  const dummyHash = '$2a$10$zCwQJ6QwQJ6QwQJ6QwQJ6uQJ6QwQJ6QwQJ6QwQJ6QwQJ6QwQJ6QW';
  const passwordHash = user?.passwordHash || dummyHash;
  const passwordEntered =  user ? password : '';
  const valid = await bcrypt.compare(password, passwordHash);
  // Always return the same error for invalid credentials
  if (!user || !user.passwordHash || !valid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  await createSession(user._id?.toString() || '');
  return NextResponse.json({ success: true });
}
