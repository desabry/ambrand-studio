"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Project } from "@/types/project";
import { ArrowLeft, Edit, Trash2, ExternalLink, Calendar, User, Tag } from "lucide-react";
import Link from "next/link";

const BLOCK_ICONS: Record<string, string> = {
  image: "📷", text: "📝", grid: "🖼️", video: "🎬",
  embed: "🔗", lightroom: "🎨", prototype: "📐", "3d": "🧊",
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async () => {
    if (!confirm("Delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", params.id);
    if (error) {
      alert("Error deleting project");
    } else {
      router.push("/dashboard/projects");
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-surface-100 rounded w-1/3" />
          <div className="aspect-video bg-surface-100 rounded-xl" />
          <div className="h-4 bg-surface-100 rounded w-full" />
          <div className="h-4 bg-surface-100 rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center">
        <p className="text-surface-500 text-lg">Project not found</p>
        <Link href="/dashboard/projects" className="text-brand hover:underline mt-4 inline-block">Back to projects</Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/projects" className="p-2 text-surface-500 hover:text-brand hover:bg-brand-light rounded-lg transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-surface-900 tracking-tight">{project.title}</h1>
            <p className="text-sm text-surface-500">{project.category}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/projects/${project.id}/edit`} className="btn-secondary">
            <Edit size={16} />
            Edit
          </Link>
          <button onClick={handleDelete} className="btn-secondary text-rose-600 hover:bg-rose-50 border-rose-200">
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      {/* Cover */}
      {project.cover_url && (
        <div className="rounded-xl overflow-hidden border border-surface-200">
          <img src={project.cover_url} alt={project.title} className="w-full aspect-video object-cover" />
        </div>
      )}

      {/* Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {project.client && (
          <div className="card p-4 flex items-center gap-3">
            <User size={18} className="text-surface-400" />
            <div>
              <p className="text-xs text-surface-500">Client</p>
              <p className="text-sm font-medium text-surface-900">{project.client}</p>
            </div>
          </div>
        )}
        {project.date && (
          <div className="card p-4 flex items-center gap-3">
            <Calendar size={18} className="text-surface-400" />
            <div>
              <p className="text-xs text-surface-500">Date</p>
              <p className="text-sm font-medium text-surface-900">{project.date}</p>
            </div>
          </div>
        )}
        {project.project_url && (
          <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="card p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
            <ExternalLink size={18} className="text-surface-400" />
            <div>
              <p className="text-xs text-surface-500">Live URL</p>
              <p className="text-sm font-medium text-brand truncate">View project</p>
            </div>
          </a>
        )}
      </div>

      {/* Tags */}
      {project.tags && project.tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Tag size={16} className="text-surface-400" />
          {project.tags.map((tag, i) => (
            <span key={i} className="px-2.5 py-1 bg-surface-100 text-surface-600 rounded-full text-xs font-medium">{tag}</span>
          ))}
        </div>
      )}

      {/* Description */}
      {project.description && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-surface-900 mb-3">Description</h2>
          <p className="text-surface-600 leading-relaxed whitespace-pre-wrap">{project.description}</p>
        </div>
      )}

      {/* Blocks */}
      {project.blocks && project.blocks.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-surface-900">Content Blocks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(project.blocks as any[]).map((block: any, i: number) => (
              <div key={block.id || i} className="card p-4 flex items-center gap-3">
                <span className="text-2xl">{BLOCK_ICONS[block.type] || "📄"}</span>
                <div>
                  <p className="text-sm font-medium text-surface-900 capitalize">{block.type}</p>
                  <p className="text-xs text-surface-500">Block #{i + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-surface-500">Status:</span>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
          project.status === "Published" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
          project.status === "Archived" ? "bg-rose-50 text-rose-700 border-rose-100" :
          "bg-surface-50 text-surface-600 border-surface-200"
        }`}>
          {project.status || "Draft"}
        </span>
      </div>
    </div>
  );
}
