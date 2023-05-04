"use client";
import { agent, useATPAuthentication } from "@/context/ATPProvider";
import { useAuthorization } from "@/vibes/auth";
import { useState } from "react";
import { z } from "zod";
import { Form } from "./form";

const LoginSchema = z.object({
  username: z
    .string()
    .describe("Bluesky Username // pfrazee.com or pfrazee.bsky.social"),
  password: z.string().describe("Bluesky Password"),
});

export const Profile = ({}) => {
  const { egoDid, egoHandle, setLoginResponseData } = useAuthorization(agent);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isAuthenticated, login, logout } = useATPAuthentication();

  const handleSubmit = async (data: z.infer<typeof LoginSchema>) => {
    setIsSubmitting(true);

    try {
      await login(data.username, data.password);

      setIsSubmitting(false);

      console.log("logged in!");
      // window.location.pathname = "/editor";
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <h1>{egoHandle}</h1>
      ) : (
        <div>
          Not logged in
          <Form
            schema={LoginSchema}
            onSubmit={handleSubmit}
            renderAfter={(submit) => (
              <button
                className="w-full bg-blue-700 text-white hover:bg-blue-900 py-2 rounded-md"
                type="submit"
                disabled={isSubmitting}
              >
                Login
              </button>
            )}
          />
        </div>
      )}
    </div>
  );
};
