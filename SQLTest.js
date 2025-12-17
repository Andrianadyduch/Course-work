import pkg from "pg";
const { Client } = pkg;

const client = new Client({
  user: "andriana",
  host: "localhost",
  database: "course_db",
  password: "",
  port: 5432
});

async function measure(name, fn, iterations = 150) {
  const times = [];

  await fn();

  for (let i = 0; i < iterations; i++) {
    const start = process.hrtime.bigint();
    await fn();
    const end = process.hrtime.bigint();

    const ms = Number(end - start) / 1e6;
    times.push(ms);
  }

  const avg = times.reduce((a, b) => a + b, 0) / times.length;

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
}

async function testFindClient() {
  await client.query(`
    SELECT *
    FROM "Client"
    LEFT JOIN "Order" ON "Order"."clientId" = "Client"."id"
    WHERE "Client"."id" = 1
  `);
}

async function testClientsWithManyOrders() {
  await client.query(`
    SELECT "clientId"
    FROM "Order"
    GROUP BY "clientId"
    HAVING COUNT("id") >= 2
  `);
}

async function testMassSelect() {
  await client.query(`
    SELECT *
    FROM "Client"
    LEFT JOIN "Order" ON "Order"."clientId" = "Client"."id"
  `);
}

async function testSortedSelect() {
  await client.query(`
    SELECT *
    FROM "Client"
    ORDER BY "surname" ASC
    LIMIT 50
  `);
}

async function testLikeSearch() {
  await client.query(`
    SELECT *
    FROM "Client"
    WHERE "surname" LIKE '%енко%'
  `);
}

async function testDeepJoin() {
  await client.query(`
    SELECT o.id, od.quantity, p.name AS product
    FROM "Order" o
    JOIN "OrderDetail" od ON od."orderId" = o."id"
    JOIN "Product" p ON p."id" = od."productId"
    WHERE o."clientId" = 1
    LIMIT 30
  `);
}

async function testSumAggregation() {
  await client.query(`
    SELECT "orderId", SUM(quantity) AS totalQty
    FROM "OrderDetail"
    GROUP BY "orderId"
  `);
}

async function testInsert() {
  await client.query(`
    INSERT INTO "Client" ("surname", "name")
    VALUES ('TestInsert', 'Client')
  `);
}

async function main() {
  console.log("Підключення до PostgreSQL...");
  await client.connect();
  console.log("Підключено");

  await measure(" Find 1 client", testFindClient);
  await measure(" Clients with >=2 orders", testClientsWithManyOrders);
  await measure(" Mass SELECT", testMassSelect);
  await measure(" Sorted SELECT", testSortedSelect);
  await measure(" LIKE search", testLikeSearch);
  await measure(" Deep JOIN", testDeepJoin);
  await measure(" Aggregation SUM", testSumAggregation);
  await measure(" INSERT test", testInsert);

  console.log("Зʼєднання з БД закрито");
  await client.end();
  process.exit();
}

main();

