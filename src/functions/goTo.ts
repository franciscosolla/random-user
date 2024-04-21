export const goTo = (path: string) => {
  window.history.pushState({ path }, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}