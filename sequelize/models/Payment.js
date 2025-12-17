import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import Order from "./Order.js";

const Payment = sequelize.define("Payment", {
  method: DataTypes.STRING,
  amount: DataTypes.FLOAT,
});

Order.hasOne(Payment, { foreignKey: "orderId" });
Payment.belongsTo(Order, { foreignKey: "orderId" });

export default Payment;
