import { useATP } from "atproto-react/client";
import { useCallback, useMemo } from "react";

type AuthTranslator = {
  isLoading: boolean;
  isAuthenticated: boolean;
  fetchAccessToken: (args: {
    forceRefreshToken: boolean;
  }) => Promise<string | null>;
};

export function useAuthFromATP(): AuthTranslator {
  const { isLoading, isAuthenticated, getToken } = useATP();

  console.log({
    isLoading,
    isAuthenticated,
    getToken,
  });

  const fetchAccessToken = useCallback(
    async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
      // forceRefreshToken doesn't do anything currently
      // because the ATP client doesn't support it
      const token = await getToken({ ignoreCache: forceRefreshToken });
      return token;
    },
    [getToken],
  );

  return useMemo(
    () => ({
      isLoading,
      isAuthenticated: isAuthenticated ?? false,
      fetchAccessToken,
    }),
    [fetchAccessToken, isAuthenticated, isLoading],
  );
}
