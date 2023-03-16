import { defineOnLoad } from "chooksie";
import type { CreationOptional } from "sequelize";
import { DataTypes, Model, Sequelize } from "sequelize";

// Reference: https://discordjs.guide/sequelize/#alpha-connection-information
const sequelize = new Sequelize("database", "user", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  // SQLite only
  storage: "database.sqlite",
});

// A table for storing points for each user.

export class Points extends Model {
  public declare user: string;
  public declare points: number;
}

Points.init(
  {
    user: {
      type: DataTypes.STRING,
      unique: true,
    },
    points: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "tags",
  }
);

export const chooksOnLoad = defineOnLoad(async () => {
  // Sync changes every time we make changes to the file.
  await sequelize.sync();
});
