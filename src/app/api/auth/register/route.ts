import { NextRequest, NextResponse } from 'next/server';
import { UserRepository } from '@/db/user.repository';
import { PasswordUtils } from '@/lib/passwords/password';
import { connectToDatabase } from '@/db/mongo';



export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
  }

  const userRepo = new UserRepository();
  const protectedPassword = await PasswordUtils.protect(password);
  
  const existing = await userRepo.findByEmail(email);
  if (existing) {
    return NextResponse.json({ error: 'User already exists' }, { status: 409 });
  }

  await userRepo.createUser({ email}, protectedPassword);

  return NextResponse.json({ success: true });
}
