import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './db';
import authRoutes from './routes/auth';
import membersRoutes from './routes/members';
import eventsRoutes from './routes/events';
import donationsRoutes from './routes/donations';

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://igreja-app-admin.vercel.app',
  ],
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor funcionando!' });
});

// Routes
app.use('/auth', authRoutes);
app.use('/members', membersRoutes);
app.use('/events', eventsRoutes);
app.use('/donations', donationsRoutes);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

export default app;
