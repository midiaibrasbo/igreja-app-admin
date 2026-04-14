import express from 'express';
import { db } from '../db';
import { events, eventAttendance } from '../db/schema';
import { eq } from 'drizzle-orm';

const router = express.Router();

// Listar todos os eventos
router.get('/', async (req, res) => {
  try {
    const allEvents = await db.select().from(events);
    res.json(allEvents);
  } catch (error) {
    console.error('Erro ao listar eventos:', error);
    res.status(500).json({ error: 'Erro ao listar eventos' });
  }
});

// Obter um evento por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const event = await db
      .select()
      .from(events)
      .where(eq(events.id, parseInt(id)))
      .limit(1);

    if (event.length === 0) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    res.json(event[0]);
  } catch (error) {
    console.error('Erro ao obter evento:', error);
    res.status(500).json({ error: 'Erro ao obter evento' });
  }
});

// Criar novo evento
router.post('/', async (req, res) => {
  try {
    const { title, description, eventDate, location, eventType, capacity, createdBy } = req.body;

    if (!title || !eventDate) {
      return res.status(400).json({ error: 'Título e data são obrigatórios' });
    }

    const newEvent = await db
      .insert(events)
      .values({
        title,
        description,
        eventDate: new Date(eventDate),
        location,
        eventType,
        capacity,
        createdBy,
      })
      .returning();

    res.status(201).json(newEvent[0]);
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    res.status(500).json({ error: 'Erro ao criar evento' });
  }
});

// Atualizar evento
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, eventDate, location, eventType, capacity } = req.body;

    const updatedEvent = await db
      .update(events)
      .set({
        title,
        description,
        eventDate: eventDate ? new Date(eventDate) : undefined,
        location,
        eventType,
        capacity,
        updatedAt: new Date(),
      })
      .where(eq(events.id, parseInt(id)))
      .returning();

    if (updatedEvent.length === 0) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    res.json(updatedEvent[0]);
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    res.status(500).json({ error: 'Erro ao atualizar evento' });
  }
});

// Deletar evento
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEvent = await db
      .delete(events)
      .where(eq(events.id, parseInt(id)))
      .returning();

    if (deletedEvent.length === 0) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    res.json({ message: 'Evento deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar evento:', error);
    res.status(500).json({ error: 'Erro ao deletar evento' });
  }
});

// Registrar presença
router.post('/:eventId/attendance', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { memberId, attended } = req.body;

    const newAttendance = await db
      .insert(eventAttendance)
      .values({
        eventId: parseInt(eventId),
        memberId,
        attended,
      })
      .returning();

    res.status(201).json(newAttendance[0]);
  } catch (error) {
    console.error('Erro ao registrar presença:', error);
    res.status(500).json({ error: 'Erro ao registrar presença' });
  }
});

export default router;
