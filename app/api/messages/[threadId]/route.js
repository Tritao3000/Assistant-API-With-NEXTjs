import { createMessage, getMessages, runAssistant } from '@/app/utils/OpenAI';

export default async function handler(req, res) {
  const { threadId } = req.query;

  if (req.method === 'POST') {
    try {
      const { content } = req.body;
      const message = await createMessage({ threadId, content });
      const assistantId = 'YOUR_ASSISTANT_ID'; // Replace with your assistant ID
      await runAssistant({ assistantId, threadId, instructions: content });
      res.status(200).json(message);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      const messages = await getMessages(threadId);
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
