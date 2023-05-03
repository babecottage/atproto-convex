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
