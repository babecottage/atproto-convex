"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { BskyAgent } from "@atproto/api";
import type { AtpSessionData, AtpSessionEvent } from "@atproto/api";
import * as jwt from "jsonwebtoken";

import { useLocalStorageState } from "@/hooks/hooks";
import type { LoginResponseDataType } from "@/vibes/bsky";

export const agent = new BskyAgent({
  service: "https://bsky.social",
  // persistSession: (evt: AtpSessionEvent, sess?: AtpSessionData) => {
  //   switch (evt) {
  //     case "create":
  //     case "update":
  //       // sess && sessionData.set(sess);
  //       break;
  //     case "expired":
  //     case "create-failed":
  //       // sessionData.set(null);
  //       break;
  //   }
  // },
});

export type RefreshJwtType = {
  exp: number;
  iat: number;
  jti: string; // long random key
  scope: string; // "com.atproto.refresh"
  sub: string; // did
};

export type AccessJwtType = {
  exp: number;
  iat: number;
  scope: string;
  sub: string;
};

type ATPAuthenticationContextType = {
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getToken: () => string | null;
};

export const ATPAuthenticationContext =
  createContext<ATPAuthenticationContextType>({
    isLoading: false,
    isAuthenticated: false,
    login: async () => {},
    logout: async () => {},
    getToken: () => null,
  });

export const ATPProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [loginResponseData, setLoginResponseData] =
    useLocalStorageState<LoginResponseDataType | null>(
      "@loginResopnseData",
      null,
    );

  const accessJwt = !!loginResponseData?.accessJwt
    ? (jwt.decode(loginResponseData.accessJwt) as AccessJwtType)
    : null;

  const loginExpiration = accessJwt?.exp;
  const timeUntilLoginExpire = loginExpiration
    ? loginExpiration * 1000 - Date.now()
    : null;

  const isAuthenticated = useMemo(() => {
    return !!loginResponseData;
  }, [loginResponseData]);

  useEffect(() => {
    if (timeUntilLoginExpire) {
      const timeout = setTimeout(() => {
        setLoginResponseData(null);
      }, Math.max(timeUntilLoginExpire, 0));

      return () => clearTimeout(timeout);
    }
  }, [timeUntilLoginExpire, setLoginResponseData]);

  useEffect(() => {
    if (loginResponseData && !agent.session) {
      agent.resumeSession(loginResponseData);
    }
  }, [loginResponseData]);

  const login = async (username: string, password: string) => {
    setIsLoading(true);

    try {
      const response = await agent.login({
        identifier: username,
        password,
      });

      if (response.success) {
        setLoginResponseData({ ...response.data });
        // setIsAuthenticated(true);
      } else {
        setLoginResponseData(null);
        // setIsAuthenticated(false);
      }
    } catch (err) {
      setLoginResponseData(null);
      // setIsAuthenticated(false);
    }

    setIsLoading(false);
  };

  const logout = async () => {
    setLoginResponseData(null);
    // setIsAuthenticated(false);
  };

  const value: ATPAuthenticationContextType = {
    isLoading,
    isAuthenticated,
    login,
    logout,
    getToken: () => null,
  };

  return (
    <ATPAuthenticationContext.Provider value={value}>
      {children}
    </ATPAuthenticationContext.Provider>
  );
};

export const useATPAuthentication = () => {
  const { isAuthenticated, login, logout } = useContext(
    ATPAuthenticationContext,
  );

  return {
    isAuthenticated,
    login,
    logout,
  };
};

// // translation from ATPProvider to ConvexReactClientAPI
// export const useAuthFromATP = () => {
//   const { isLoading, isAuthenticated, getToken } = use;
// };
