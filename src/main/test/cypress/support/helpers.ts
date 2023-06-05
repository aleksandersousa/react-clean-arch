export const testLocalStorageItem = (key: string): void => {
  cy.window().then(window => assert.isOk(window.localStorage.getItem(key)));
};

export const setLocalStorageItem = (key: string, value: object): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getLocalStorageItem = (key: string): any =>
  JSON.parse(localStorage.getItem(key));
