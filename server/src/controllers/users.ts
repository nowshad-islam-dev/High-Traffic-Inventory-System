import { Users } from '../models';

export async function createUser(username: string) {
  const newUser = await Users.create({
    username,
  });
  return newUser;
}
