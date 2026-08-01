import { prisma } from './db';

const allowedGroups = new Set(['photographer', 'client', 'camera', 'city']);

function normalizeGroup(group: string) {
  return group.trim().toLowerCase();
}

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
  const normalizedGroup = normalizeGroup(group);
  if (!isAllowedGroup(normalizedGroup)) {
    return [];
  }

  await ensureTypeTable();

  try {
    const rows = await prisma.$queryRawUnsafe<Array<{ Value: string }>>(
      `SELECT \`Value\` FROM \`Type\` WHERE \`Group\` = ? ORDER BY \`Value\` ASC`,
      normalizedGroup
    );

    return rows.map((row) => row.Value);
  } catch (error) {
    console.error('getTypeValues failed:', error);
    return [];
  }
}

export async function addTypeValue(group: string, value: string) {
  const normalizedGroup = normalizeGroup(group);
  if (!isAllowedGroup(normalizedGroup)) {
    return [];
  }

  await ensureTypeTable();

  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return [];
  }

  try {
    await prisma.$executeRawUnsafe(`INSERT IGNORE INTO \`Type\` (\`Group\`, \`Value\`) VALUES (?, ?)`, normalizedGroup, trimmedValue);
  } catch (error) {
    console.error('addTypeValue failed:', error);
  }

  return getTypeValues(normalizedGroup);
}
