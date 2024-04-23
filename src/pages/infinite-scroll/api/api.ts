import { User } from "../../../shared/types/RandomUserApi";

const BASE_URL = 'https://randomuser.me/api/';
const LIMIT = 10;

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
            users = data.results;
            return [...users];
          })
      );
    }
  }

  const patchUser = async (id: string, user: Partial<User>) => {
    let index = users.findIndex(({ id: userId }) => userId === id);

    if (index) {
      users[index].data = { ...users[index].data, ...user };
      return users[index];
    }
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