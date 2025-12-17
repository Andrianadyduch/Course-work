import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import Client from "./Client.js";

const Order = sequelize.define("Order", {
  date: DataTypes.DATE,
  status: DataTypes.STRING,
  address: DataTypes.STRING,
  deliveryStatus: DataTypes.STRING,
});

Client.hasMany(Order, { foreignKey: "clientId" });
Order.belongsTo(Client, { foreignKey: "clientId" });

export default Order;
