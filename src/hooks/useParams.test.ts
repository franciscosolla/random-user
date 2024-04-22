import { goTo } from "../functions/goTo";
import { useParams } from "./useParams";
import { renderHook, act, waitFor } from "@testing-library/react";

describe("useParams", () => {
  it("should return the current URLSearchParams", async () => {
    goTo('/test?page=1&results=1');

    const { result } = renderHook(() => useParams());

    expect(result.current.toString()).toEqual(new URLSearchParams("page=1&results=1").toString());

    act(() => {
      goTo('/test?page=2&results=2');
    });

    await waitFor(() => {
      expect(result.current.toString()).toEqual(new URLSearchParams("page=2&results=2").toString());
    });
  });
});

