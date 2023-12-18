import { createMessage, getMessages, runAssistant } from '@/app/utils/OpenAI';
import { NextResponse } from 'next/server';

export async function POST(req) {
  console.log('olá');
  try {
    console.log('olá');
    const { threadId } = req.query;
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
  console.log('alo');
  try {
    let passedValue = await new Response(req.query).text();
    let queryreq = JSON.parse(passedValue);
    console.log(queryreq);
    const { id } = await queryreq;
    console.log(id);
    const messages = await getMessages(threadId);
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
