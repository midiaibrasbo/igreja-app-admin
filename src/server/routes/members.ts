import express from 'express';
import { db } from '../db';
import { members } from '../db/schema';
import { eq } from 'drizzle-orm';

const router = express.Router();

// Listar todos os membros
router.get('/', async (req, res) => {
  try {
    const allMembers = await db.select().from(members);
    res.json(allMembers);
  } catch (error) {
    console.error('Erro ao listar membros:', error);
    res.status(500).json({ error: 'Erro ao listar membros' });
  }
});

// Obter um membro por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const member = await db
      .select()
      .from(members)
      .where(eq(members.id, parseInt(id)))
      .limit(1);

    if (member.length === 0) {
      return res.status(404).json({ error: 'Membro não encontrado' });
    }

    res.json(member[0]);
  } catch (error) {
    console.error('Erro ao obter membro:', error);
    res.status(500).json({ error: 'Erro ao obter membro' });
  }
});

// Criar novo membro
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, birthDate, baptismDate, address, status } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Nome e email são obrigatórios' });
    }

    const newMember = await db
      .insert(members)
      .values({
        name,
        email,
        phone,
        birthDate: birthDate ? new Date(birthDate) : null,
        baptismDate: baptismDate ? new Date(baptismDate) : null,
        address,
        status: status || 'active',
      })
      .returning();

    res.status(201).json(newMember[0]);
  } catch (error) {
    console.error('Erro ao criar membro:', error);
    res.status(500).json({ error: 'Erro ao criar membro' });
  }
});

// Atualizar membro
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, birthDate, baptismDate, address, status } = req.body;

    const updatedMember = await db
      .update(members)
      .set({
        name,
        email,
        phone,
        birthDate: birthDate ? new Date(birthDate) : null,
        baptismDate: baptismDate ? new Date(baptismDate) : null,
        address,
        status,
        updatedAt: new Date(),
      })
      .where(eq(members.id, parseInt(id)))
      .returning();

    if (updatedMember.length === 0) {
      return res.status(404).json({ error: 'Membro não encontrado' });
    }

    res.json(updatedMember[0]);
  } catch (error) {
    console.error('Erro ao atualizar membro:', error);
    res.status(500).json({ error: 'Erro ao atualizar membro' });
  }
});

// Deletar membro
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedMember = await db
      .delete(members)
      .where(eq(members.id, parseInt(id)))
      .returning();

    if (deletedMember.length === 0) {
      return res.status(404).json({ error: 'Membro não encontrado' });
    }

    res.json({ message: 'Membro deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar membro:', error);
    res.status(500).json({ error: 'Erro ao deletar membro' });
  }
});

export default router;
