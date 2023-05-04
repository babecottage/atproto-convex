/**
 * tysmmmm @louislva
 * https://github.com/louislva/skyline/blob/main/helpers/bsky.ts
 */

export type LoginResponseDataType = {
  accessJwt: string;
  did: string;
  email?: string;
  handle: string;
  refreshJwt: string;
};

// tysm @sabigara/flat
export type AtpError = {
  error: "NotFound";
  message: string;
};

export function isAtpError(err: unknown): err is AtpError {
  if (typeof err !== "object" || err === null) return false;
  return "error" in err && "message" in err;
}
