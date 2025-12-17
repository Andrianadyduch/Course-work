
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function measure(name, fn, iterations = 150
) {
  const times = [];

  await fn();

  for (let i = 0; i < iterations; i++) {
    const start = process.hrtime.bigint();
    await fn();
    const end = process.hrtime.bigint();

    const ms = Number(end - start) / 1e6;
    times.push(ms);
  }

  const avg = times.reduce((sum, t) => sum + t, 0) / times.length;

  const min = Math.min(...times);
  const max = Math.max(...times);

  const mae =
    times.reduce((sum, t) => sum + Math.abs(t - avg), 0) / times.length;

  console.log(`\n=== ${name} ===`);
  console.log(`Avg: ${avg.toFixed(2)} ms`);
  console.log(`Min: ${min.toFixed(2)} ms`);
  console.log(`Max: ${max.toFixed(2)} ms`);
  console.log(`MAE: ${mae.toFixed(2)} ms`);
  console.log(`Result: (${avg.toFixed(2)} ± ${mae.toFixed(2)}) ms`);

  return { name, avg, min, max, mae };
}

async function testFindClientWithOrders() {
  await prisma.client.findUnique({
    where: { id: 1 },
    include: { orders: true }
  });
}

async function testClientsWithManyOrders() {
  await prisma.order.groupBy({
    by: ['clientId'],
    _count: { clientId: true },
    having: {
      clientId: {
        _count: { gte: 2 }
      }
    }
  });
}

async function testMassSelect() {
  await prisma.client.findMany({
    include: { orders: true }
  });
}

async function testSortedClients() {
  await prisma.client.findMany({
    orderBy: { surname: 'asc' },
    take: 50
  });
}

async function testSearchBySurname() {
  await prisma.client.findMany({
    where: {
      surname: { contains: 'енко' }
    }
  });
}

async function testDeepJoin() {
  await prisma.order.findMany({
    include: {
      orderDetails: {
        include: { product: true }
      },
      client: true,
      payment: true
    },
    take: 30
  });
}

async function testOrderAggregation() {
  await prisma.orderDetail.groupBy({
    by: ['orderId'],
    _sum: { quantity: true }
  });
}

async function testInsertClient() {
  await prisma.client.create({
    data: {
      surname: 'Test',
      name: 'User'
    }
  });
}



async function main() {
  try {
    console.log('Підключення до бази...');
    await prisma.$connect();
    console.log('Підключено');

    await measure(
      'Prisma: Find 1 client with orders',
      testFindClientWithOrders
    );

    await measure(
      'Prisma: Clients with >=2 orders ',
      testClientsWithManyOrders
    );

    await measure(
      'Prisma: Mass SELECT ',
      testMassSelect
    );

    await measure(
      'Prisma: Sorted select ',
      testSortedClients
    );

    await measure(
      'Prisma: Text search ',
      testSearchBySurname
    );

    await measure(
      'Prisma: Deep join ',
      testDeepJoin
    );

    await measure(
      'Prisma: Aggregation SUM',
      testOrderAggregation
    );

    await measure(
      'Prisma: INSERT test',
      testInsertClient
    );

  } catch (error) {
    console.error('Помилка:', error);
  } finally {
    await prisma.$disconnect();
    console.log('\nЗʼєднання з БД закрито');
  }
}

main();

