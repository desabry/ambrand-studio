export interface Project {
  id: string;
  title: string;
  client?: string;
  category: string;
  status?: string;
  date?: string;
  description?: string;
  tags?: string[];
  views?: number;
  likes?: number;
  cover_url?: string;
  emoji?: string;
  project_url?: string;
  blocks?: ProjectBlock[];
  created_at: string;
  updated_at?: string;
}

export interface ProjectBlock {
  id: string;
  type: 'image' | 'text' | 'grid' | 'video' | 'embed' | 'lightroom' | 'prototype' | '3d';
  content: Record<string, any>;
  order: number;
}
