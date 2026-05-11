"use client";

import { useState, useEffect } from "react";
import { Project, ProjectBlock } from "@/types/project";
import { BlockBuilder } from "./BlockBuilder";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

interface Props {
  initialData?: Project;
  onSave: (data: Partial<Project>) => Promise<void>;
  isSaving?: boolean;
}

const CATEGORIES = [
  "Branding", "Logo Design", "Packaging Design", "Motion Graphics",
  "Website Design", "3D Design",
];

export function ProjectForm({ initialData, onSave, isSaving }: Props) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [client, setClient] = useState(initialData?.client || "");
  const [category, setCategory] = useState(initialData?.category || "Branding");
  const [status, setStatus] = useState(initialData?.status || "Draft");
  const [description, setDescription] = useState(initialData?.description || "");
  const [coverUrl, setCoverUrl] = useState(initialData?.cover_url || "");
  const [projectUrl, setProjectUrl] = useState(initialData?.project_url || "");
  const [emoji, setEmoji] = useState(initialData?.emoji || "🎨");
  const [tagsStr, setTagsStr] = useState(initialData?.tags?.join(", ") || "");
  const [blocks, setBlocks] = useState<ProjectBlock[]>(initialData?.blocks || []);
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split("T")[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      title,
      client,
      category,
      status,
      description,
      cover_url: coverUrl,
      project_url: projectUrl,
      emoji,
      tags: tagsStr.split(",").map((t) => t.trim()).filter(Boolean),
      blocks,
      date,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/projects" className="p-2 text-surface-500 hover:text-brand hover:bg-brand-light rounded-lg transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-surface-900 tracking-tight">
              {initialData ? "Edit Project" : "New Project"}
            </h1>
            <p className="text-sm text-surface-500">{initialData ? "Update project details and blocks" : "Create a new project"}</p>
          </div>
        </div>
        <button type="submit" disabled={isSaving || !title.trim()} className="btn-primary">
          <Save size={18} />
          {isSaving ? "Saving..." : "Save Project"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6 space-y-5">
            <h2 className="text-lg font-semibold text-surface-900">Basic Info</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Project name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Client</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="Client name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Category</label>
                <select
                  className="w-full px-3 py-2 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Status</label>
                <select
                  className="w-full px-3 py-2 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Emoji</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                  value={emoji}
                  onChange={(e) => setEmoji(e.target.value)}
                  maxLength={2}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Description</label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Project description..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                value={tagsStr}
                onChange={(e) => setTagsStr(e.target.value)}
                placeholder="branding, packaging, premium"
              />
            </div>
          </div>

          {/* Block builder */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-surface-900 mb-4">Content Blocks</h2>
            <BlockBuilder blocks={blocks} onChange={setBlocks} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card p-6 space-y-4">
            <h2 className="text-lg font-semibold text-surface-900">Media</h2>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Cover Image URL</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder="https://..."
              />
              {coverUrl && (
                <img src={coverUrl} alt="Cover preview" className="mt-2 w-full h-32 object-cover rounded-lg" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Project URL</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                value={projectUrl}
                onChange={(e) => setProjectUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
