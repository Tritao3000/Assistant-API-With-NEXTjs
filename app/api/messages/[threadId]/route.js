import { createMessage, getMessages, runAssistant } from '@/app/utils/OpenAI';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { threadId } = req.query.threadId;
    console.log(threadId);
    const { content } = req.body;
    console.log(content);
    const message = await createMessage({ threadId, content });
    const assistantId = process.env.ASSISTANT_ID;
    console.log(assistantId);
    await runAssistant({ assistantId, threadId, instructions: content });
    return NextResponse.json(message);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function GET(req) {
  try {
    const { threadId } = req.query.threadId;
    const messages = await getMessages(threadId);
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
