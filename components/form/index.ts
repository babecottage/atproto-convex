import { z } from "zod";
import { TextField } from "./TextField";
import { createTsForm } from "@ts-react/form";

// TODO: add more types
const mapping = [[z.string(), TextField]] as const;

export const Form = createTsForm(mapping);
