import { NextResponse } from 'next/server';
import { createThread, gethread, deleteThread } from '../../utils/OpenAI';

export async function POST(req, res) {
  try {
    const thread = await createThread();
    return NextResponse.json(thread);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
