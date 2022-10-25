import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Comments = sequelize.define(
  "Comments",
  {
    content: { type: DataTypes.STRING, allowNull: false },
    username: { type: DataTypes.STRING, allowNull: false },
  },
  {
    // Other model options go here
  }
);

export default Comments;