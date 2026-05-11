"use client";

import { useState, useCallback } from "react";
import { ProjectBlock } from "@/types/project";
import {
  Camera, FileText, ThumbsUp, Play, Code, SlidersHorizontal, LayoutTemplate, Box,
  Trash2, GripVertical, Plus, ChevronUp, ChevronDown
} from "lucide-react";

const BLOCK_TYPES = [
  { type: "image" as const, label: "Image", icon: Camera },
  { type: "text" as const, label: "Text", icon: FileText },
  { type: "grid" as const, label: "Photo Grid", icon: ThumbsUp },
  { type: "video" as const, label: "Video", icon: Play },
  { type: "embed" as const, label: "Embed", icon: Code },
  { type: "lightroom" as const, label: "Lightroom", icon: SlidersHorizontal },
  { type: "prototype" as const, label: "Prototype", icon: LayoutTemplate },
  { type: "3d" as const, label: "3D Model", icon: Box },
];

interface Props {
  blocks: ProjectBlock[];
  onChange: (blocks: ProjectBlock[]) => void;
}

let blockCounter = 0;

function createBlock(type: ProjectBlock["type"]): ProjectBlock {
  blockCounter++;
  const base: ProjectBlock = {
    id: `block-${Date.now()}-${blockCounter}`,
    type,
    content: {},
    order: 0,
  };
  switch (type) {
    case "text":
      base.content = { text: "Enter your text here..." };
      break;
    case "image":
      base.content = { src: "", alt: "", caption: "" };
      break;
    case "grid":
      base.content = { images: ["", "", "", ""] };
      break;
    case "video":
      base.content = { url: "", title: "" };
      break;
    case "embed":
      base.content = { code: "" };
      break;
    case "lightroom":
      base.content = { url: "", preset: "" };
      break;
    case "prototype":
      base.content = { url: "", label: "" };
      break;
    case "3d":
      base.content = { url: "", label: "" };
      break;
  }
  return base;
}

export function BlockBuilder({ blocks, onChange }: Props) {
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);

  const addBlock = useCallback((type: ProjectBlock["type"]) => {
    const newBlock = createBlock(type);
    newBlock.order = blocks.length;
    onChange([...blocks, newBlock]);
    setActiveBlockId(newBlock.id);
  }, [blocks, onChange]);

  const removeBlock = useCallback((id: string) => {
    onChange(blocks.filter((b) => b.id !== id).map((b, i) => ({ ...b, order: i })));
    setActiveBlockId(null);
  }, [blocks, onChange]);

  const moveBlock = useCallback((id: string, direction: "up" | "down") => {
    const idx = blocks.findIndex((b) => b.id === id);
    if (idx === -1) return;
    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= blocks.length) return;
    const newBlocks = [...blocks];
    [newBlocks[idx], newBlocks[newIdx]] = [newBlocks[newIdx], newBlocks[idx]];
    onChange(newBlocks.map((b, i) => ({ ...b, order: i })));
  }, [blocks, onChange]);

  const updateBlockContent = useCallback((id: string, content: Record<string, any>) => {
    onChange(blocks.map((b) => (b.id === id ? { ...b, content } : b)));
  }, [blocks, onChange]);

  return (
    <div className="space-y-6">
      {/* Block palette */}
      <div>
        <label className="block text-sm font-medium text-surface-700 mb-2">Add Block</label>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {BLOCK_TYPES.map((bt) => (
            <button
              key={bt.type}
              type="button"
              onClick={() => addBlock(bt.type)}
              className="flex flex-col items-center gap-1 p-3 rounded-xl border border-surface-200 bg-white hover:border-brand hover:text-brand hover:bg-brand-light transition-all text-surface-500 text-xs"
            >
              <bt.icon size={20} />
              <span className="text-[10px] font-medium">{bt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Blocks */}
      <div className="space-y-3">
        {blocks.length === 0 && (
          <p className="text-sm text-surface-400 text-center py-8 border-2 border-dashed border-surface-200 rounded-xl">
            Click a block type above to start building
          </p>
        )}
        {blocks.map((block, index) => (
          <BlockEditor
            key={block.id}
            block={block}
            index={index}
            total={blocks.length}
            isActive={activeBlockId === block.id}
            onToggle={() => setActiveBlockId(activeBlockId === block.id ? null : block.id)}
            onMoveUp={() => moveBlock(block.id, "up")}
            onMoveDown={() => moveBlock(block.id, "down")}
            onRemove={() => removeBlock(block.id)}
            onChange={(content) => updateBlockContent(block.id, content)}
          />
        ))}
      </div>
    </div>
  );
}

function BlockEditor({
  block, index, total, isActive, onToggle, onMoveUp, onMoveDown, onRemove, onChange,
}: {
  block: ProjectBlock;
  index: number;
  total: number;
  isActive: boolean;
  onToggle: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  onChange: (content: Record<string, any>) => void;
}) {
  const iconMap: Record<string, any> = {
    image: Camera, text: FileText, grid: ThumbsUp, video: Play,
    embed: Code, lightroom: SlidersHorizontal, prototype: LayoutTemplate, "3d": Box,
  };
  const Icon = iconMap[block.type] || FileText;

  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${isActive ? "border-brand shadow-sm" : "border-surface-200"}`}>
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 bg-surface-50 cursor-pointer"
        onClick={onToggle}
      >
        <GripVertical size={16} className="text-surface-300 cursor-grab" />
        <Icon size={16} className="text-brand" />
        <span className="text-sm font-medium text-surface-700 capitalize flex-1">
          {block.type} {index > 0 && <span className="text-surface-400 font-normal">— #{index + 1}</span>}
        </span>
        <div className="flex items-center gap-0.5">
          <button type="button" onClick={(e) => { e.stopPropagation(); onMoveUp(); }} disabled={index === 0} className="p-1 text-surface-400 hover:text-surface-600 disabled:opacity-30">
            <ChevronUp size={16} />
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); onMoveDown(); }} disabled={index === total - 1} className="p-1 text-surface-400 hover:text-surface-600 disabled:opacity-30">
            <ChevronDown size={16} />
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); onRemove(); }} className="p-1 text-surface-400 hover:text-rose-600 ml-2">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Content editor */}
      {isActive && (
        <div className="p-4 space-y-3">
          <BlockContentEditor block={block} onChange={onChange} />
        </div>
      )}
    </div>
  );
}

function BlockContentEditor({ block, onChange }: { block: ProjectBlock; onChange: (content: Record<string, any>) => void }) {
  const set = (key: string, value: any) => onChange({ ...block.content, [key]: value });

  switch (block.type) {
    case "text":
      return (
        <div>
          <label className="block text-xs font-medium text-surface-500 mb-1">Text Content</label>
          <textarea
            rows={4}
            className="w-full px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
            value={block.content.text || ""}
            onChange={(e) => set("text", e.target.value)}
          />
        </div>
      );

    case "image":
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-surface-500 mb-1">Image URL</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              value={block.content.src || ""}
              onChange={(e) => set("src", e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-surface-500 mb-1">Caption</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              value={block.content.caption || ""}
              onChange={(e) => set("caption", e.target.value)}
            />
          </div>
        </div>
      );

    case "grid":
      return (
        <div className="space-y-2">
          <label className="block text-xs font-medium text-surface-500 mb-1">Image URLs (4 max)</label>
          {(block.content.images as string[] || ["", "", "", ""]).map((url: string, i: number) => (
            <input
              key={i}
              type="text"
              className="w-full px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              value={url}
              onChange={(e) => {
                const images = [...(block.content.images || ["", "", "", ""])];
                images[i] = e.target.value;
                set("images", images);
              }}
              placeholder={`Image ${i + 1} URL`}
            />
          ))}
        </div>
      );

    case "video":
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-surface-500 mb-1">Video URL</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              value={block.content.url || ""}
              onChange={(e) => set("url", e.target.value)}
              placeholder="https://youtube.com/..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-surface-500 mb-1">Title</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              value={block.content.title || ""}
              onChange={(e) => set("title", e.target.value)}
            />
          </div>
        </div>
      );

    case "embed":
      return (
        <div>
          <label className="block text-xs font-medium text-surface-500 mb-1">Embed Code</label>
          <textarea
            rows={3}
            className="w-full px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
            value={block.content.code || ""}
            onChange={(e) => set("code", e.target.value)}
            placeholder="<iframe ...>"
          />
        </div>
      );

    case "lightroom":
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-surface-500 mb-1">Lightroom URL</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              value={block.content.url || ""}
              onChange={(e) => set("url", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-surface-500 mb-1">Preset</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              value={block.content.preset || ""}
              onChange={(e) => set("preset", e.target.value)}
            />
          </div>
        </div>
      );

    case "prototype":
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-surface-500 mb-1">Prototype URL</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              value={block.content.url || ""}
              onChange={(e) => set("url", e.target.value)}
              placeholder="https://figma.com/..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-surface-500 mb-1">Label</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              value={block.content.label || ""}
              onChange={(e) => set("label", e.target.value)}
              placeholder="View Prototype"
            />
          </div>
        </div>
      );

    case "3d":
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-surface-500 mb-1">3D Model URL</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              value={block.content.url || ""}
              onChange={(e) => set("url", e.target.value)}
              placeholder="https://sketchfab.com/..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-surface-500 mb-1">Label</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              value={block.content.label || ""}
              onChange={(e) => set("label", e.target.value)}
            />
          </div>
        </div>
      );

    default:
      return <p className="text-sm text-surface-400">No editor for this block type.</p>;
  }
}
