export const delay = (timeInMilliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, timeInMilliseconds, 'ok'));
