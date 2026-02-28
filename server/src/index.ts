import { createServer } from 'node:http';
import app from './app';
import env from './config/env';
import { sequelize } from './config/db';
import { initSocket } from './config/socket';
import { cleanupExpiredReservations } from './services/recoverStock';
import './models';

const server = createServer(app);

async function setup() {
  try {
    await sequelize.authenticate();
    console.log('DB connection OK✅');

    await sequelize.sync();
    console.log('Models in sync with DB');

    initSocket(server);

    server.listen(env.PORT, () =>
      console.log(`Server listening at http://localhost:${env.PORT}`),
    );
  } catch (err) {
    console.error('Failed to start server❌');
    process.exit(1);
  }
}

setup();

setInterval(() => {
  console.log('Cleaning up expired reservations...');
  cleanupExpiredReservations();
}, 10000);
