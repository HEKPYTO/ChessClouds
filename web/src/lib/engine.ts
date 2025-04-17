const ENGINE_API_URL = process.env.NEXT_PUBLIC_ENGINE_API_URL!;
const MAX_RETRIES = 5;
const RETRY_DELAY = 1000;
const BACKOFF_FACTOR = 1.5;

async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = MAX_RETRIES
): Promise<any> {
  const resp = await fetch(url, options);
  if (!resp.ok) {
    if (retries > 1) {
      await new Promise(r => setTimeout(r, RETRY_DELAY * Math.pow(BACKOFF_FACTOR, MAX_RETRIES - retries)));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw new Error(`Request failed: ${resp.status}`);
  }
  return resp.json();
}

export function getEngineStatus() {
  return fetchWithRetry(`${ENGINE_API_URL}/`);
}

export function testEngine() {
  return fetchWithRetry(`${ENGINE_API_URL}/test`);
}

export function getBestMove(fen: string) {
  const encoded = encodeURIComponent(fen);
  return fetchWithRetry(`${ENGINE_API_URL}/bestmove?fen=${encoded}`);
}