"use client";

import { useState } from "react";
import { useATP } from "atproto-react/client";
import { z } from "zod";

import { Form } from "./form";

const LoginSchema = z.object({
  username: z
    .string()
    .describe("Bluesky Username // pfrazee.com or pfrazee.bsky.social"),
  password: z.string().describe("Bluesky Password"),
});

export const Profile = ({}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useATP();
  const handleSubmit = async (data: z.infer<typeof LoginSchema>) => {
    setIsSubmitting(true);

    try {
      await login(data.username, data.password);

      setIsSubmitting(false);
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {false ? (
        <h1>hi</h1>
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
