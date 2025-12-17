import sequelize from "./sequelize/index.js";
import Client from "./sequelize/models/Client.js";
import Order from "./sequelize/models/Order.js";
import OrderDetail from "./sequelize/models/OrderDetail.js";
import Product from "./sequelize/models/Product.js";
import { Op } from "sequelize";

function calculateMAE(times, avg) {
  return (
    times.reduce((sum, t) => sum + Math.abs(t - avg), 0) / times.length
  );
}

async function measure(name, fn, iterations = 150) {
  const times = [];

  await fn();

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await fn();
    const end = performance.now();
    times.push(end - start);
  }

  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  const min = Math.min(...times);
  const max = Math.max(...times);
  const mae = calculateMAE(times, avg);

  console.log(`\n=== ${name} ===`);
  console.log(`Avg: ${avg.toFixed(2)} ms`);
  console.log(`Min: ${min.toFixed(2)} ms`);
  console.log(`Max: ${max.toFixed(2)} ms`);
  console.log(`MAE: ${mae.toFixed(2)} ms`);
  console.log(`Result: (${avg.toFixed(2)} ± ${mae.toFixed(2)}) ms`);
}

async function testFindClient() {
  await Client.findOne({
    where: { id: 1 },
    include: Order
  });
}

async function testJoinGroup() {
  await Order.findAll({
    attributes: ["clientId"],
    group: ["clientId"],
    having: sequelize.literal(`COUNT("Order"."id") >= 2`)
  });
}

async function testMassSelect() {
  await Client.findAll({
    include: Order
  });
}

async function testSortedSelect() {
  await Client.findAll({
    order: [["surname", "ASC"]],
    limit: 50
  });
}

async function testLikeSearch() {
  await Client.findAll({
    where: {
      surname: { [Op.like]: "%енко%" }
    }
  });
}

async function testDeepJoin() {
  await Order.findAll({
    include: [
      {
        model: OrderDetail,
        include: [Product]
      }
    ],
    limit: 30
  });
}

async function testSumAggregation() {
  await OrderDetail.findAll({
    attributes: [
      "orderId",
      [sequelize.fn("SUM", sequelize.col("quantity")), "totalQty"]
    ],
    group: ["orderId"]
  });
}

async function testInsert() {
  await Client.create({
    surname: "TestInsert",
    name: "Client"
  });
}


async function main() {
  console.log("Підключення до бази даних...");
  await sequelize.authenticate();
  console.log("Підключено");

  await measure("Sequelize: Find 1 client", testFindClient);
  await measure("Sequelize: Clients with >=2 orders (JOIN + GROUP)", testJoinGroup);
  await measure("Sequelize: Mass SELECT (all clients)", testMassSelect);
  await measure("Sequelize: Sorted SELECT (ORDER BY)", testSortedSelect);
  await measure("Sequelize: LIKE search", testLikeSearch);
  await measure("Sequelize: Deep JOIN", testDeepJoin);
  await measure("Sequelize: Aggregation SUM", testSumAggregation);
  await measure("Sequelize: INSERT test", testInsert);

  await sequelize.close();
  console.log("\nЗʼєднання з БД закрито");
}

main().catch(console.error);
