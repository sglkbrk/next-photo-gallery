import { prisma } from './db';

function serializeContact<T extends { created: Date }>(item: T) {
  return {
    ...item,
    created: item.created.toISOString()
  };
}

export async function getAllContactMessages() {
  const messages = await prisma.contantMe.findMany({
    orderBy: { created: 'desc' }
  });
  return messages.map(serializeContact);
}

export async function createContactMessage(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const item = await prisma.contantMe.create({
    data: {
      ...data,
      created: new Date()
    }
  });
  return serializeContact(item);
}
