import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Product = sequelize.define("Product", {
  category: DataTypes.STRING,
  name: DataTypes.STRING,
  price: DataTypes.FLOAT,
});

export default Product;
