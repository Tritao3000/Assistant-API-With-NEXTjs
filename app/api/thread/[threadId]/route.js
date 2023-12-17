import { NextResponse } from 'next/server';
import { getThread } from '@/app/utils/OpenAI';

//run the assistant
export async function GET(req) {
  const { threadId } = req.query;
  try {
    const thread = await getThread(threadId);
    return NextResponse.json(thread);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
