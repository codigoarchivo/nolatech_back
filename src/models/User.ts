import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/connection';
import { IUser } from '../interfaces/userInterfaces';

class User extends Model<IUser> implements IUser {
  public id!: number;
  public first_name!: string;
  public last_name!: string;
  public email!: string;
  public profile_image!: string;
  public password!: string;
  public is_active!: boolean;
  public is_admin!: boolean;
  public created_at!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profile_image: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
  },
  {
    modelName: 'user',
    tableName: 'users', 
    timestamps: false,
    sequelize,
  }
);

export default User;
