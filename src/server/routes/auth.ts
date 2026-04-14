import express from 'express';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { generateToken } from '../auth/jwt';
import { hashPassword, verifyPassword } from '../auth/password';
import { verifyGoogleToken } from '../auth/google';

const router = express.Router();

// Registro com email/senha
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, senha e nome são obrigatórios' });
    }

    // Verificar se usuário já existe
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email já registrado' });
    }

    // Hash da senha
    const hashedPassword = await hashPassword(password);

    // Criar usuário
    const newUser = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        name,
        role: 'member',
      })
      .returning();

    const user = newUser[0];
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
});

// Login com email/senha
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Buscar usuário
    const userList = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (userList.length === 0) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    const user = userList[0];

    // Verificar senha
    if (!user.password || !(await verifyPassword(password, user.password))) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// Login com Google
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token do Google é obrigatório' });
    }

    // Verificar token do Google
    const profile = await verifyGoogleToken(token);

    if (!profile) {
      return res.status(401).json({ error: 'Token do Google inválido' });
    }

    // Buscar ou criar usuário
    let userList = await db
      .select()
      .from(users)
      .where(eq(users.googleId, profile.id))
      .limit(1);

    let user = userList[0];

    if (!user) {
      // Criar novo usuário
      const newUserList = await db
        .insert(users)
        .values({
          email: profile.email,
          name: profile.name,
          googleId: profile.id,
          avatar: profile.picture,
          role: 'member',
        })
        .returning();

      user = newUserList[0];
    }

    const jwtToken = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('Erro no login com Google:', error);
    res.status(500).json({ error: 'Erro ao fazer login com Google' });
  }
});

export default router;
