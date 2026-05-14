"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Project } from "@/types/project";
import { ProjectForm } from "@/components/projects/ProjectForm";

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) {
        console.error("Error loading project:", error);
      } else {
        setProject(data);
      }
      setLoading(false);
    }
    load();
  }, [params.id]);

  const handleSave = async (formData: any) => {
    setIsSaving(true);
    const { blocks, ...projectData } = formData;
    const { error } = await supabase
      .from("projects")
      .update({
        title: projectData.title || "",
        description: projectData.description || "",
      })
      .eq("id", params.id);

    setIsSaving(false);

    if (error) {
      alert("Error saving project: " + error.message);
    } else {
      router.push(`/dashboard/projects/${params.id}`);
      router.refresh();
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-surface-100 rounded w-1/3" />
          <div className="h-64 bg-surface-100 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center text-surface-500">
        Project not found
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <ProjectForm initialData={project} onSave={handleSave} isSaving={isSaving} />
    </div>
  );
}
