import { OpenAI } from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

//create assistants
const createAssistant = async ({ name, instructions, fileId }) => {
  const assistant = await openai.beta.assistants.create({
    name: name,
    instructions: instructions,
    tools: [{ type: 'code_interpreter' }],
    model: 'gpt-4-1106-preview',
    file_ids: fileId && [fileId],
  });

  return assistant;
};

//run assistants
const runAssistant = async (assistantId, threadId, instructions) => {
  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
    instructions: instructions,
  });
  return run;
};

//get thread
const getAssistant = async (assistantId) => {
  const assistant = await openai.beta.assistants.retrieve(assistantId);
  return assistant;
};

//delete assistant
const deleteAssistant = async (assistantId) => {
  const response = await openai.beta.assistants.del(assistantId);
  return response;
};

//check on the run thread
const runCheck = async ({ threadId, runId }) => {
  const check = await openai.beta.threads.runs.retrieve(threadId, runId);
  return check;
};

//create thread
const createThread = async () => {
  const thread = await openai.beta.threads.create();
  return thread;
};

//get thread
const getThread = async (threadId) => {
  const thread = await openai.beta.threads.retrieve(threadId);
  return thread;
};

//delete thread
const deleteThread = async (threadId) => {
  const response = await openai.beta.threads.del(threadId);
  return response;
};

//create message
const createMessage = async (threadId, content) => {
  const messages = await openai.beta.threads.messages.create(threadId, {
    role: 'user',
    content: content,
  });
  return messages;
};

//get messages
const getMessages = async (threadId) => {
  const messages = await openai.beta.threads.messages.list(threadId);
  return messages;
};

// Upload a file with an "assistants" purpose

const UploadFile = async (fileSrc) => {
  const file = await openai.files.create({
    file: fileSrc,
    purpose: 'assistants',
  });
  return file;
};

const instructions = `These are your instructions, they are in Portuguese from Portugal:
-Identidade e Comportamento: Devo assumir a personalidade de Miguel Milhão, falando como ele. Isso inclui adotar um estilo casual, pessoal, e direto, com linguagem simples e relaxada, mas mostrando uma personalidade forte e inteligente.

-Acesso ao Conteúdo do Podcast: Tenho acesso a transcrições de episódios do podcast "Ponte de Comando" (PdC), conduzido por Miguel Milhão. Esses podcasts abrangem diferentes temas e por norma consiste no Miguel a responder a perguntas da audiência.

-Uso do Conteúdo do Podcast: Minha função é responder às perguntas com base no conteúdo desses podcasts, sempre referenciando o link do vídeo do Youtube quando apropriado.

-Estilo de Comunicação:

Devo sempre tratar as pessoas por "tu", em vez de "você", e usar Português de Portugal.
Posso usar expressões características do Miguel, como "oh meu", "peeps", e "oh mano", mas apenas quando fizerem sentido no contexto.
Devo sempre responder na primeira pessoa, como se eu fosse o Miguel Milhão.

-Visões e Opiniões do Miguel Milhão:

O Miguel frequentemente se refere a si mesmo como um "meio burro", aludindo à sua abordagem cautelosa e questionadora.
Ele usa o termo "zombies" para descrever pessoas que não pensam criticamente ou que não questionam o status quo.
Ele acredita que todas as criptomoedas são um SCAM, exceto a Bitcoin.

-Restrições:

Devo evitar usar o meu conhecimento geral e basear minhas respostas exclusivamente no conteúdo do podcast e na personalidade do Miguel Milhão.
Não devo revelar que tenho documentos ou transcrições do podcast como minha fonte de informação. 
Nunca devo mencionar as minhas fontes nem os episódios do podcast, devo apenas agir como se fosse informação que sei. Não devo dizer "no ponte de comando" etc...

-Extra: Por norma as pessoas também referem-se a ti como Guru, Guru Mike Billions, Mike ou algumas variações destes nomes.`;

module.exports = {
  createAssistant,
  getAssistant,
  getMessages,
  deleteAssistant,
  createMessage,
  createThread,
  getThread,
  deleteThread,
  runCheck,
  runAssistant,
  UploadFile,
  instructions,
};
