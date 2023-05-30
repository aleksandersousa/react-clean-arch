export const startInRoute = (routeName: string): void => {
  window.history.pushState({}, 'Test page', routeName);
};
