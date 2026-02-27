import { Server } from 'socket.io';
import { createServer } from 'node:http';
import app from './app';
import env from './config/env';
import { sequelize } from './config/db';
import './models';

const server = createServer(app);

async function setup() {
  try {
    await sequelize.authenticate();
    console.log('DB connection OK✅');
    await sequelize.sync();
    console.log('Models in sync with DB');
  } catch (err) {
    console.error('DB connection error❌');
  }
}
setup();

const io = new Server(server);

io.on('connection', (socket) => {
  console.log('A new user connected');
  socket.on('disconnect', () => console.log('User disconnected'));
});

server.listen(env.PORT, () =>
  console.log(`Server listening at http://localhost:${env.PORT}`),
);
