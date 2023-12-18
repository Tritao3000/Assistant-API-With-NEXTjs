import { createMessage, getMessages, runAssistant } from '@/app/utils/OpenAI';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // req.query is undefined
    let passedValue = await new Response(req.body).text();
    let bodyreq = JSON.parse(passedValue);

    const { threadId } = bodyreq;

    const messages = await getMessages(threadId);
    return NextResponse.json(messages);
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
