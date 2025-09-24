import { User } from "../models/User";


export const getCollectors = async (): Promise<User[]> => {
  // Simulate fetching collectors from an API or database
  return new Promise((resolve) => {
    setTimeout(() => {
      const collectors = localStorage.getItem('r-users')??'[]';
      const collectorsArray = JSON.parse(collectors)

      resolve(collectorsArray.filter((user: User) => user.role === 'collector'));
    }, 1000);
  });
};
