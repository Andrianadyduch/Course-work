import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import Order from "./Order.js";
import Product from "./Product.js";

const OrderDetail = sequelize.define("OrderDetail", {
  quantity: DataTypes.INTEGER,
});

Order.hasMany(OrderDetail, { foreignKey: "orderId" });
OrderDetail.belongsTo(Order, { foreignKey: "orderId" });

Product.hasMany(OrderDetail, { foreignKey: "productId" });
OrderDetail.belongsTo(Product, { foreignKey: "productId" });

export default OrderDetail;
