import { NextResponse } from 'next/server';
import { createThread, gethread, deleteThread } from '../../utils/OpenAI';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const thread = await createThread();
      res.status(200).json(thread);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}