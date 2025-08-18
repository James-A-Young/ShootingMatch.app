import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/db/mongo';
import { User } from '@/db/user.model';
import { createSession } from '../../session';

const MICROSOFT_CLIENT_ID = process.env.MICROSOFT_CLIENT_ID || '';
const MICROSOFT_CLIENT_SECRET = process.env.MICROSOFT_CLIENT_SECRET || '';
const REDIRECT_URI = process.env.MICROSOFT_REDIRECT_URI || '';

async function getTokens(code: string) {
  const params = new URLSearchParams({
    client_id: MICROSOFT_CLIENT_ID,
    scope: 'user.read openid email profile',
    code,
    redirect_uri: REDIRECT_URI,
    grant_type: 'authorization_code',
    client_secret: MICROSOFT_CLIENT_SECRET,
  });
  const res = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });
  return res.json();
}

async function getMicrosoftUser(access_token: string) {
  const res = await fetch('https://graph.microsoft.com/v1.0/me', {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  return res.json();
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  if (!code) return NextResponse.json({ error: 'No code' }, { status: 400 });
  const tokens = await getTokens(code);
  const profile = await getMicrosoftUser(tokens.access_token);
  if (!profile.mail && !profile.userPrincipalName) return NextResponse.json({ error: 'No email' }, { status: 400 });
  const email = profile.mail || profile.userPrincipalName;
  const { db } = await connectToDatabase();
  let user = await db.collection<User>('users').findOne({ email });
  if (!user) {
    const now = new Date();
    user = {
      email,
      microsoftId: profile.id,
      createdAt: now,
      updatedAt: now,
    };
    await db.collection<User>('users').insertOne(user);
  } else if (!user.microsoftId) {
    await db.collection<User>('users').updateOne({ _id: user._id }, { $set: { microsoftId: profile.id, updatedAt: new Date() } });
  }
  await createSession(user._id?.toString() || '');
  return NextResponse.redirect('/');
}
