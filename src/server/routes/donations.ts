import express from 'express';
import { db } from '../db';
import { donations } from '../db/schema';
import { eq } from 'drizzle-orm';

const router = express.Router();

// Listar todas as doações
router.get('/', async (req, res) => {
  try {
    const allDonations = await db.select().from(donations);
    res.json(allDonations);
  } catch (error) {
    console.error('Erro ao listar doações:', error);
    res.status(500).json({ error: 'Erro ao listar doações' });
  }
});

// Obter uma doação por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const donation = await db
      .select()
      .from(donations)
      .where(eq(donations.id, parseInt(id)))
      .limit(1);

    if (donation.length === 0) {
      return res.status(404).json({ error: 'Doação não encontrada' });
    }

    res.json(donation[0]);
  } catch (error) {
    console.error('Erro ao obter doação:', error);
    res.status(500).json({ error: 'Erro ao obter doação' });
  }
});

// Criar nova doação
router.post('/', async (req, res) => {
  try {
    const { memberId, amount, donationType, description, recordedBy } = req.body;

    if (!amount) {
      return res.status(400).json({ error: 'Valor é obrigatório' });
    }

    const newDonation = await db
      .insert(donations)
      .values({
        memberId,
        amount,
        donationType,
        description,
        recordedBy,
      })
      .returning();

    res.status(201).json(newDonation[0]);
  } catch (error) {
    console.error('Erro ao criar doação:', error);
    res.status(500).json({ error: 'Erro ao criar doação' });
  }
});

// Atualizar doação
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, donationType, description } = req.body;

    const updatedDonation = await db
      .update(donations)
      .set({
        amount,
        donationType,
        description,
        updatedAt: new Date(),
      })
      .where(eq(donations.id, parseInt(id)))
      .returning();

    if (updatedDonation.length === 0) {
      return res.status(404).json({ error: 'Doação não encontrada' });
    }

    res.json(updatedDonation[0]);
  } catch (error) {
    console.error('Erro ao atualizar doação:', error);
    res.status(500).json({ error: 'Erro ao atualizar doação' });
  }
});

// Deletar doação
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDonation = await db
      .delete(donations)
      .where(eq(donations.id, parseInt(id)))
      .returning();

    if (deletedDonation.length === 0) {
      return res.status(404).json({ error: 'Doação não encontrada' });
    }

    res.json({ message: 'Doação deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar doação:', error);
    res.status(500).json({ error: 'Erro ao deletar doação' });
  }
});

export default router;
