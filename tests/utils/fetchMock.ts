import { jest } from "@jest/globals";
import { SpiedFunction } from "jest-mock";

export type FetchMock = SpiedFunction<{
  (input: URL | RequestInfo, init?: RequestInit | undefined): Promise<Response>;
  (
    input: string | URL | Request,
    init?: RequestInit | undefined
  ): Promise<Response>;
}>;

const assetsFetchMock = () =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: async () => ({}),
  } as Response);

export const on = () => {
  const fetchMock: FetchMock = jest
    .spyOn(global, "fetch")
    .mockImplementation(assetsFetchMock);

  return fetchMock;
};

export const off = () => {
  jest.restoreAllMocks();
};
