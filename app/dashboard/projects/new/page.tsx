"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { useState } from "react";

export default function NewProjectPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (data: any) => {
    setIsSaving(true);
    const { blocks, ...projectData } = data;
    const { error } = await supabase.from("projects").insert({
      ...projectData,
      updated_at: new Date().toISOString(),
    });
    setIsSaving(false);

    if (error) {
      alert("Error creating project: " + error.message);
    } else {
      router.push("/dashboard/projects");
      router.refresh();
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <ProjectForm onSave={handleSave} isSaving={isSaving} />
    </div>
  );
}
