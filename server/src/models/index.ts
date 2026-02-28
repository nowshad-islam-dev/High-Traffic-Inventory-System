import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import { sequelize } from '../config/db';

interface Drops extends Model<
  InferAttributes<Drops>,
  InferCreationAttributes<Drops>
> {
  id: CreationOptional<number>;
  name: string;
  price: number;
  totalStock: number;
  availableStock: number;
}

export const Drops = sequelize.define<Drops>('drop', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  totalStock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  availableStock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
});

interface Users extends Model<
  InferAttributes<Users>,
  InferCreationAttributes<Users>
> {
  id: CreationOptional<number>;
  username: string;
}
export const Users = sequelize.define<Users>('user', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

interface Reservations extends Model<
  InferAttributes<Reservations>,
  InferCreationAttributes<Reservations>
> {
  id: CreationOptional<number>;
  status: 'reserved' | 'purchased' | 'expired';
  expiresAt: Date;
  dropId?: number;
  userId?: number;
}

export const Reservations = sequelize.define<Reservations>('reservation', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  status: {
    type: DataTypes.ENUM,
    values: ['reserved', 'purchased', 'expired'],
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

interface Purchases extends Model<
  InferAttributes<Purchases>,
  InferCreationAttributes<Purchases>
> {
  id: CreationOptional<number>;
  purchasedAt: CreationOptional<Date>;
  userId?: number;
  dropId?: number;
}

export const Purchases = sequelize.define<Purchases>('Purchase', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  purchasedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// A Drop has many Purchases
Drops.hasMany(Purchases, { foreignKey: 'dropId' });
Purchases.belongsTo(Drops, { foreignKey: 'dropId' });

// A User has many Purchases
Users.hasMany(Purchases, { foreignKey: 'userId' });
Purchases.belongsTo(Users, { foreignKey: 'userId' });

// Reservations link Users and Drops
Users.hasMany(Reservations, { foreignKey: 'userId' });
Drops.hasMany(Reservations, { foreignKey: 'dropId' });
Reservations.belongsTo(Users, { foreignKey: 'userId' });
Reservations.belongsTo(Drops, { foreignKey: 'dropId' });
