import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Client = sequelize.define("Client", {
  surname: DataTypes.STRING,
  name: DataTypes.STRING,
});

export default Client;
