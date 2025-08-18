import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/db/mongo';
import { User } from '@/db/user.model';
import { createSession } from '../../session';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || '';

async function getTokens(code: string) {
  const params = new URLSearchParams({
    code,
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    grant_type: 'authorization_code',
  });
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });
  return res.json();
}

async function getGoogleUser(access_token: string) {
  const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  return res.json();
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  if (!code) return NextResponse.json({ error: 'No code' }, { status: 400 });
  const tokens = await getTokens(code);
  const profile = await getGoogleUser(tokens.access_token);
  if (!profile.email) return NextResponse.json({ error: 'No email' }, { status: 400 });
  const { db } = await connectToDatabase();
  let user = await db.collection<User>('users').findOne({ email: profile.email });
  if (!user) {
    const now = new Date();
    user = {
      email: profile.email,
      googleId: profile.id,
      createdAt: now,
      updatedAt: now,
    };
    await db.collection<User>('users').insertOne(user);
  } else if (!user.googleId) {
    await db.collection<User>('users').updateOne({ _id: user._id }, { $set: { googleId: profile.id, updatedAt: new Date() } });
  }
  await createSession(user._id?.toString() || '');
  return NextResponse.redirect('/');
}
