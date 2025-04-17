import {
  EngineMessageResponse,
  EngineTestResponse,
  BestMoveResponse,
  EngineType,
} from '@/types/engineTypes';

const ENGINE_API_URL = process.env.NEXT_PUBLIC_ENGINE_API_URL!;
const MAX_RETRIES = 5;
const RETRY_DELAY = 1000;
const BACKOFF_FACTOR = 1.5;

async function fetchWithRetry<T extends EngineType>(
  url: string,
  options: RequestInit = {},
  retries = MAX_RETRIES
): Promise<T> {
  const resp = await fetch(url, options);
  if (!resp.ok) {
    if (retries > 1) {
      const delay =
        RETRY_DELAY * Math.pow(BACKOFF_FACTOR, MAX_RETRIES - retries);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry<T>(url, options, retries - 1);
    }
    throw new Error(`Request failed: ${resp.status}`);
  }
  return resp.json() as Promise<T>;
}

export function getEngineStatus(): Promise<EngineMessageResponse> {
  return fetchWithRetry<EngineMessageResponse>(`${ENGINE_API_URL}/`);
}

export function testEngine(): Promise<EngineTestResponse> {
  return fetchWithRetry<EngineTestResponse>(`${ENGINE_API_URL}/test`);
}

export function getBestMove(fen: string): Promise<BestMoveResponse> {
  const encoded = encodeURIComponent(fen);
  return fetchWithRetry<BestMoveResponse>(
    `${ENGINE_API_URL}/bestmove?fen=${encoded}`
  );
}
