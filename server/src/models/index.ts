import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db';

export const Drops = sequelize.define('drop', {
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

export const Users = sequelize.define('user', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export const Reservations = sequelize.define('reservation', {
  status: {
    type: DataTypes.ENUM,
    values: ['reserved', 'purchased', 'expired'],
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

export const Purchases = sequelize.define('Purchase', {
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
