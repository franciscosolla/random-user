import { getParams } from "./getParams";
import { goTo } from "./goTo";

export const updatePage = ({ page, results }: { page?: number, results?: string }) => {
  const params = getParams();

  if (page) {
    params.set("page", String(page));
  }

  if (results) {
    params.set("results", results);
  }

  goTo(`/?${params.toString()}`);
};