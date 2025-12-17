import { Sequelize } from "sequelize";

const sequelize = new Sequelize("course_db", "andriana", "", {
  host: "localhost",
  dialect: "postgres",
  logging: false
});

export default sequelize;
