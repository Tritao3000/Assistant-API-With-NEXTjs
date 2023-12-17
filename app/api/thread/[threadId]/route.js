import { NextResponse } from 'next/server';
import { getThread } from '@/app/utils/OpenAI';

//run the assistant
export default async function handler(req, res) {
  const { threadId } = req.query;

  if (req.method === 'GET') {
    try {
      const thread = await getThread(threadId);
      res.status(200).json(thread);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
