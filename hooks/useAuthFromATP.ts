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

  const fetchAccessToken = useCallback(
    async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
      const token = await getToken({ ignoreCache: forceRefreshToken });

      return token;
    },
    [getToken],
  );

  return useMemo(() => {
    return {
      isLoading,
      isAuthenticated: isAuthenticated ?? false,
      fetchAccessToken,
    };
  }, [fetchAccessToken, isAuthenticated, isLoading]);
}
