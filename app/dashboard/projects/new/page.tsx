"use client";

import { useRouter } from "next/navigation";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { useState } from "react";
import { createProjectAction } from "../actions";

export default function NewProjectPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (data: any) => {
    setIsSaving(true);
    const { blocks, ...projectData } = data;
    try {
      await createProjectAction(projectData);
      router.push("/dashboard/projects");
      router.refresh();
    } catch (err: any) {
      alert("Error creating project: " + (err.message || "Unknown error"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <ProjectForm onSave={handleSave} isSaving={isSaving} />
    </div>
  );
}
