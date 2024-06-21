import { TypesUser } from '~/types/users';

export const STORAGE_KEY_LANGUAGE_SELECTED = 'STORAGEKEYLANGUAGESELECTED';
export const UsersTypeOptions = [
  { key: String(TypesUser.Dealer), value: 'dealer' },
  { key: String(TypesUser.Employee), value: 'employee' },
  { key: String(TypesUser.Admin), value: 'admin' },
];
export const LIMIT_PER_PAGE = 5;

