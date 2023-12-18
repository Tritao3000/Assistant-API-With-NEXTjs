import { createMessage, getMessages, runAssistant } from '@/app/utils/OpenAI';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    let passedValue = await new Response(req.body).text();
    let bodyreq = JSON.parse(passedValue);

    const { messageContent, threadId } = await bodyreq;
    console.log(messageContent, threadId);

    // died here below
    const message = await createMessage({ threadId, content });
    console.log('message created');

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
    // req.query is undefined
    console.log(req.query);
    const { threadId } = req.query.threadId;
    console.log(threadId);
    const messages = await getMessages(threadId);
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
