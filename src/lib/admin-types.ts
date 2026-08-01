import { prisma } from './db';

const allowedGroups = new Set(['photographer', 'client', 'camera', 'city']);

async function ensureTypeTable() {
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`Type\` (
        \`Id\` INT NOT NULL AUTO_INCREMENT,
        \`Group\` VARCHAR(191) NOT NULL,
        \`Value\` VARCHAR(191) NOT NULL,
        \`CreatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`Id\`),
        UNIQUE KEY \`IX_Type_Group_Value\` (\`Group\`, \`Value\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  } catch (error) {
    console.error('ensureTypeTable failed:', error);
  }
}

export function isAllowedGroup(group: string): boolean {
  return allowedGroups.has(group);
}

export async function getTypeValues(group: string) {
  if (!isAllowedGroup(group)) {
    return [];
  }

  await ensureTypeTable();

  try {
    const rows = await prisma.type.findMany({
      where: { group },
      orderBy: { value: 'asc' },
      select: { value: true }
    });

    return rows.map((row) => row.value);
  } catch (error) {
    console.error('getTypeValues failed:', error);
    return [];
  }
}

export async function addTypeValue(group: string, value: string) {
  if (!isAllowedGroup(group)) {
    return [];
  }

  await ensureTypeTable();

  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return [];
  }

  try {
    await prisma.type.create({
      data: {
        group,
        value: trimmedValue
      }
    });
  } catch (error) {
    console.error('addTypeValue failed:', error);
  }

  return getTypeValues(group);
}
