import { Project } from "@/types/project";
import { ProjectStatusBadge } from "./ProjectStatusBadge";
import { Eye, Edit, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";

interface Props {
  project: Project;
  onDelete?: (id: string) => void;
}

export function ProjectCard({ project, onDelete }: Props) {
  return (
    <div className="group bg-white rounded-xl border border-surface-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Cover */}
      <Link href={`/dashboard/projects/${project.id}`} className="block relative aspect-video bg-surface-100 overflow-hidden">
        {project.cover_url ? (
          <img
            src={project.cover_url}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            {project.emoji || "🎨"}
          </div>
        )}
        <div className="absolute top-3 left-3">
          <ProjectStatusBadge status={project.status || "Draft"} />
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <div className="text-xs text-surface-500 font-medium uppercase tracking-wider mb-1">{project.category}</div>
        <h3 className="font-semibold text-surface-900 text-lg leading-tight mb-1 truncate">{project.title}</h3>
        {project.client && (
          <p className="text-sm text-surface-500 truncate">{project.client}</p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-surface-100">
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link
              href={`/dashboard/projects/${project.id}`}
              className="p-1.5 text-surface-400 hover:text-brand hover:bg-brand-light rounded-lg transition-all"
              title="View"
            >
              <Eye size={16} />
            </Link>
            <Link
              href={`/dashboard/projects/${project.id}/edit`}
              className="p-1.5 text-surface-400 hover:text-brand hover:bg-brand-light rounded-lg transition-all"
              title="Edit"
            >
              <Edit size={16} />
            </Link>
            {onDelete && (
              <button
                onClick={() => onDelete(project.id)}
                className="p-1.5 text-surface-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
          {project.project_url && (
            <a
              href={project.project_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-surface-400 hover:text-surface-600 rounded-lg transition-all"
              title="View live"
            >
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
