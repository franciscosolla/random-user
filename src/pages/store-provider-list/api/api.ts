import { User } from "../../../shared/types/RandomUserApi";

const BASE_URL = 'https://randomuser.me/api/';
const LIMIT = 50;

export const api = (() => {
  let users: Data<User>[] = [];

  const getUsers = async () => {
    if (users.length > 0) {
      return [...users];
    } else {
      return (
        fetch(`${BASE_URL}?results=${LIMIT}`)
          .then(response => response.json())
          .then(data => {
            users = data.results.map((user: User, index: number) => ({
              id: user.login.uuid ?? `${index}`,
              data: user,
            }));
            return [...users];
          })
      );
    }
  }

  const patchUser = async (id: string, user: Partial<User>) => {
    return new Promise<Data<User>>((resolve, reject) => {
      setTimeout(() => {
        if (true) {
          reject('Failed to update user');
        } else {
          let index = users.findIndex(({ id: userId }) => userId === id);

          if (index) {
            users[index].data = { ...users[index].data, ...user };
            resolve(users[index]);
          }

          reject('User not found');
        }
      }, Math.random()*1000);
    })
  }

  return ({
    getUsers,
    patchUser
  }) as const;
})();

export interface Data<T> {
  id: string;
  data: T;
}