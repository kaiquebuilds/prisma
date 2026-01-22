import { vi } from "vitest";
import createFetchMock from "vitest-fetch-mock";

const fetchMock = createFetchMock(vi);

fetchMock.enableMocks();

process.env.API_URL ??= "any-value-to-avoid-errors-in-tests";
process.env.API_KEY ??= "any-value-to-avoid-errors-in-tests";
