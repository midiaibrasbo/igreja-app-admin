import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export interface GoogleProfile {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export async function verifyGoogleToken(token: string): Promise<GoogleProfile | null> {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) return null;

    return {
      id: payload.sub,
      email: payload.email || '',
      name: payload.name || '',
      picture: payload.picture,
    };
  } catch (error) {
    console.error('Erro ao verificar token do Google:', error);
    return null;
  }
}

export function getGoogleAuthUrl(): string {
  return googleClient.generateAuthUrl({
    access_type: 'offline',
    scope: ['profile', 'email'],
  });
}
