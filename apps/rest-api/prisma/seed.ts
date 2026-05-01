import { PrismaClient } from '@prisma/client';
import { BcryptPasswordHasher } from '../src/infrastructure/auth/BcryptPasswordHasher';

const prisma = new PrismaClient();

async function main() {
  const passwordHasher = new BcryptPasswordHasher();
  const ps = await passwordHasher.hash('password');

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      hashedPassword: ps,
      taskGroups: {
        create: [
          {
            name: 'Example Task Group A',
            sort: 100,
            tasks: {
              create: [
                {
                  title: 'Test Task 1',
                  sort: 100,
                },
                {
                  title: 'Test Task 2',
                  description: 'This is a test task',
                  dueDate: '2024-12-31',
                  sort: 500,
                },
                {
                  title: 'Test Task 3',
                  description: 'This is a test task',
                  dueDate: '2024-12-31',
                  dueTime: '12:12:00',
                  sort: 1000,
                },
              ],
            },
          },
          {
            name: 'Example Task Group B',
            sort: 500,
          },
        ],
      },
    },
  });

  // biome-ignore lint/suspicious/noConsoleLog: <explanation>
  console.log({ adminUser });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
