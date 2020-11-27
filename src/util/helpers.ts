import { ConnectOptions, GovalMetadata } from '../types';

const BACKOFF_FACTOR = 1.7;
const MAX_BACKOFF = 15000;

/**
 * Calculates the backoff for n retry
 */
export function getNextRetryDelay(retryNumber: number) {
  const randomMs = Math.floor(Math.random() * 500);
  const backoff = BACKOFF_FACTOR ** retryNumber * 1000;

  return Math.min(backoff, MAX_BACKOFF) + randomMs;
}

function isWebSocket(w: unknown): w is WebSocket {
  if (typeof w !== 'object' && typeof w !== 'function') {
    return false;
  }

  if (!w) {
    return false;
  }

  return 'OPEN' in w && (w as WebSocket).OPEN === 1;
}

/**
 * Gets a websocket class from the global scope, or asserts if the supplied websocket follows the standard
 */
export function getWebSocketClass(options: ConnectOptions<unknown>) {
  if (options.WebSocketClass) {
    if (!isWebSocket(options.WebSocketClass)) {
      throw new Error('Passed in WebSocket does not look like a standard WebSocket');
    }

    return options.WebSocketClass;
  }

  if (typeof WebSocket !== 'undefined') {
    if (!isWebSocket(WebSocket)) {
      throw new Error('Global WebSocket does not look like a standard WebSocket');
    }

    return WebSocket;
  }

  throw new Error('Please pass in a WebSocket class or add it to global');
}

/**
 * Given connection metadata, creates a websocket connection string
 */
export function getConnectionStr(connectionMetadata: GovalMetadata) {
  return new URL(`/wsv2/${connectionMetadata.token}`, connectionMetadata.gurl).toString();
}