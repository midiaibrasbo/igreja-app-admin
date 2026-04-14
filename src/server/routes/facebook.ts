import express from 'express';
import axios from 'axios';

const router = express.Router();
const FACEBOOK_PAGE_ID = '1AxmZ58yqo';
const FACEBOOK_API_URL = 'https://graph.facebook.com/v18.0';

// Middleware de autenticação
const authMiddleware = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// GET /facebook/live-stream - Buscar transmissão ao vivo
router.get('/live-stream', authMiddleware, async (req: any, res: any) => {
  try {
    // Buscar vídeos ao vivo da página
    const response = await axios.get(
      `${FACEBOOK_API_URL}/${FACEBOOK_PAGE_ID}/live_videos`,
      {
        params: {
          access_token: process.env.FACEBOOK_ACCESS_TOKEN,
          fields: 'id,title,description,status,views,comments,shares',
        },
      }
    );

    const liveVideos = response.data.data || [];
    const activeLive = liveVideos.find((video: any) => video.status === 'LIVE');

    if (activeLive) {
      return res.json({
        id: activeLive.id,
        title: activeLive.title,
        description: activeLive.description,
        status: 'live',
        views: activeLive.views,
        comments: activeLive.comments,
        shares: activeLive.shares,
      });
    }

    res.json(null);
  } catch (error) {
    console.error('Erro ao buscar transmissão ao vivo:', error);
    res.status(500).json({ error: 'Erro ao buscar transmissão' });
  }
});

export default router;
