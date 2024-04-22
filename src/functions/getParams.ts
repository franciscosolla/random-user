export const getParams = (() => {
  let raw: string;
  let value: URLSearchParams;

  return () => {
    if (window.location.search !== raw) {
      raw = window.location.search;
      value = new URLSearchParams(window.location.search);
    }

    return value;
  }
})();