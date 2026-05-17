"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const projectSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  category: z.string().trim().min(1, "Category is required"),
  client: z.string().trim().optional().nullable(),
  description: z.string().trim().optional().nullable(),
  status: z.string().trim().optional().default("Draft"),
  date: z.string().trim().optional(),
  tags: z.array(z.string()).optional().default([]),
  cover_url: z.string().trim().optional().nullable(),
  emoji: z.string().trim().optional().nullable(),
  project_url: z.string().trim().optional().nullable(),
});

export async function createProjectAction(raw: Record<string, unknown>) {
  const parsed = projectSchema.safeParse(raw);

  if (!parsed.success) {
    const missing = parsed.error.issues
      .filter((i) => i.code === "too_small")
      .map((i) => i.path.join("."));
    const message =
      missing.length > 0
        ? `Missing required fields: ${missing.join(", ")}`
        : "Invalid form data";
    throw new Error(message);
  }

  const { title, category, client, description, status, date, tags, cover_url, emoji, project_url } =
    parsed.data;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const payload: Record<string, unknown> = {
    title,
    category,
    client: client ?? null,
    description: description ?? null,
    status: status ?? "Draft",
    date: date ?? null,
    tags: tags ?? [],
    cover_url: cover_url ?? null,
    emoji: emoji ?? null,
    project_url: project_url ?? null,
  };

  const { error } = await supabase.from("projects").insert(payload);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/projects");
}
