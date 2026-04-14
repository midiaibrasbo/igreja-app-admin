import express from 'express';
import axios from 'axios';
import { db } from '../db';
import { members } from '../db/schema';
import { sql } from 'drizzle-orm';

const router = express.Router();
const WHATSAPP_API_URL = 'https://graph.instagram.com/v18.0';

// Middleware de autenticação
const authMiddleware = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// GET /birthdays - Buscar aniversariantes de hoje
router.get('/', authMiddleware, async (req: any, res: any) => {
  try {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    const birthdays = await db
      .select()
      .from(members)
      .where(
        sql`DATE_FORMAT(baptism_date, '%m-%d') = ${month}-${day}`
      );

    res.json(birthdays);
  } catch (error) {
    console.error('Erro ao buscar aniversariantes:', error);
    res.status(500).json({ error: 'Erro ao buscar aniversariantes' });
  }
});

// POST /birthdays/send-message - Enviar mensagem para aniversariante
router.post('/send-message', authMiddleware, async (req: any, res: any) => {
  try {
    const { memberId, message } = req.body;

    const member = await db
      .select()
      .from(members)
      .where(sql`id = ${memberId}`)
      .limit(1);

    if (!member || !member[0]?.phone) {
      return res.status(404).json({ error: 'Membro não encontrado ou sem telefone' });
    }

    // Enviar via WhatsApp API
    const phoneNumber = member[0].phone.replace(/\D/g, '');
    
    await axios.post(
      `${WHATSAPP_API_URL}/messages`,
      {
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'text',
        text: {
          preview_url: false,
          body: message,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({ success: true, message: 'Mensagem enviada com sucesso' });
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    res.status(500).json({ error: 'Erro ao enviar mensagem' });
  }
});

// POST /birthdays/send-all-messages - Enviar mensagens para todos os aniversariantes
router.post('/send-all-messages', authMiddleware, async (req: any, res: any) => {
  try {
    const { message } = req.body;

    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    const birthdays = await db
      .select()
      .from(members)
      .where(
        sql`DATE_FORMAT(baptism_date, '%m-%d') = ${month}-${day}`
      );

    let sentCount = 0;
    for (const member of birthdays) {
      if (member.phone) {
        try {
          const phoneNumber = member.phone.replace(/\D/g, '');
          
          await axios.post(
            `${WHATSAPP_API_URL}/messages`,
            {
              messaging_product: 'whatsapp',
              to: phoneNumber,
              type: 'text',
              text: {
                preview_url: false,
                body: message,
              },
            },
            {
              headers: {
                Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
              },
            }
          );
          sentCount++;
        } catch (error) {
          console.error(`Erro ao enviar para ${member.name}:`, error);
        }
      }
    }

    res.json({
      success: true,
      message: `${sentCount} mensagens enviadas com sucesso`,
    });
  } catch (error) {
    console.error('Erro ao enviar mensagens:', error);
    res.status(500).json({ error: 'Erro ao enviar mensagens' });
  }
});

export default router;
