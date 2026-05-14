"use client";

import { useEffect, useState } from "react";
import { Plus, Search, LayoutGrid, List, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Project } from "@/types/project";
import { ProjectCard } from "@/components/projects/ProjectCard";
import Link from "next/link";

export default function ProjectsPage() {
  const supabase = createClient();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error);
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      alert("Error deleting project");
    } else {
      fetchProjects();
    }
  };

  const categories = [...new Set(projects.map((p) => p.category).filter(Boolean))];

  const filtered = projects.filter((p) => {
    const q = search.toLowerCase();
    const matchesSearch = !q || p.title.toLowerCase().includes(q) || p.client?.toLowerCase().includes(q);
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const seedDemoProject = async () => {
    const demo = {
      title: "Qahwa Coffee Branding",
      description: "A complete brand identity for a premium coffee brand, including logo design, packaging, and digital presence.",
    };
    const { error } = await supabase.from("projects").insert(demo);
    if (error) {
      alert("Error creating demo project: " + error.message);
    } else {
      fetchProjects();
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-surface-900 tracking-tight">Projects</h1>
          <p className="text-surface-500">{projects.length} project{projects.length !== 1 ? "s" : ""}</p>
        </div>
        <Link href="/dashboard/projects/new" className="btn-primary">
          <Plus size={20} />
          New Project
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-surface-200 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 bg-surface-50 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            className="bg-surface-50 border border-surface-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <div className="flex bg-surface-50 rounded-lg border border-surface-200">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white text-brand shadow-sm" : "text-surface-400 hover:text-surface-600"}`}
              title="Grid view"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white text-brand shadow-sm" : "text-surface-400 hover:text-surface-600"}`}
              title="List view"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="aspect-video bg-surface-100" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-surface-100 rounded w-1/3" />
                <div className="h-5 bg-surface-100 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-5xl mb-4">📦</div>
          <h3 className="text-lg font-semibold text-surface-900 mb-2">No projects found</h3>
          <p className="text-surface-500 mb-6">
            {search || categoryFilter !== "all" ? "Try different search or filter criteria." : "Get started by creating your first project."}
          </p>
          {!search && categoryFilter === "all" && (
            <div className="flex items-center justify-center gap-3">
              <Link href="/dashboard/projects/new" className="btn-primary inline-flex">
                <Plus size={18} />
                Create Project
              </Link>
              <button onClick={seedDemoProject} className="btn-secondary inline-flex">
                <Sparkles size={18} />
                Add Demo Project
              </button>
            </div>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <ProjectCard key={p.id} project={p} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-50 border-b border-surface-200">
                <th className="px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Title</th>
                <th className="px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Client</th>
                <th className="px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Category</th>
                <th className="px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-surface-50 transition-colors group">
                  <td className="px-5 py-3 font-medium text-surface-900">{p.title}</td>
                  <td className="px-5 py-3 text-surface-600">{p.client || "—"}</td>
                  <td className="px-5 py-3 text-surface-600">{p.category}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                      p.status === "Published" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                      p.status === "Archived" ? "bg-rose-50 text-rose-700 border-rose-100" :
                      "bg-surface-50 text-surface-600 border-surface-200"
                    }`}>
                      {p.status || "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/dashboard/projects/${p.id}`} className="p-1.5 text-surface-400 hover:text-brand hover:bg-brand-light rounded-lg transition-all text-xs">View</Link>
                      <Link href={`/dashboard/projects/${p.id}/edit`} className="p-1.5 text-surface-400 hover:text-brand hover:bg-brand-light rounded-lg transition-all text-xs">Edit</Link>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 text-surface-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all text-xs">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
