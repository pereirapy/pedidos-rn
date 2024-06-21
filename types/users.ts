export enum TypesUser {
  Dealer = 1,
  Employee = 2,
  Admin = 3
}

export type User = {
  name: string;
  email: string;
  type:TypesUser;
}

export type UserWithId = User & {
  id: string;
}