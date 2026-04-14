"use client";

import { SkillDTO, addSkillAction, removeSkillAction } from "@/lib/actions/skills";
import { SkillCategory } from "@/models/skill.model";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { toast } from "sonner";

const CATEGORY_LABELS: Record<SkillCategory, string> = {
  technical: "Technical",
  soft: "Soft Skills",
  tool: "Tools",
  language: "Languages",
};

const CATEGORY_COLORS: Record<SkillCategory, string> = {
  technical: "bg-[#2FA4D7]/[0.08] text-[#2FA4D7]/85 border-[#2FA4D7]/15",
  soft: "bg-green-500/[0.08] text-green-400/70 border-green-500/15",
  tool: "bg-[#E76F2E]/[0.08] text-[#E76F2E]/85 border-[#E76F2E]/15",
  language: "bg-amber-500/[0.08] text-amber-400/70 border-amber-400/15",
};

export default function SkillsSection({ items, isSelf }: { items: SkillDTO[]; isSelf: boolean }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<SkillCategory>("technical");
  const [isPending, startTransition] = useTransition();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    startTransition(async () => {
      try {
        await addSkillAction(name.trim(), category);
        router.refresh();
        toast.success("Skill added.");
        setName("");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to add skill.");
      }
    });
  }

  function handleRemove(id: string) {
    startTransition(async () => {
      try {
        await removeSkillAction(id);
        router.refresh();
        toast.success("Skill removed.");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to remove.");
      }
    });
  }

  const grouped = Object.entries(CATEGORY_LABELS)
    .map(([cat, label]) => ({
      category: cat as SkillCategory,
      label,
      skills: items.filter((s) => s.category === cat),
    }))
    .filter((g) => g.skills.length > 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55">Skills</h2>
        {isSelf && (
          <button onClick={() => setShowForm(!showForm)} className="rounded-lg p-1.5 text-white/55 hover:bg-white/[0.05] hover:text-white/60 transition-all">
            <Plus size={18} />
          </button>
        )}
      </div>

      {showForm && isSelf && (
        <form onSubmit={onSubmit} className="glass-panel rounded-2xl p-5 space-y-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Skill name" maxLength={50} className="glass-input w-full" />
          <select value={category} onChange={(e) => setCategory(e.target.value as SkillCategory)} className="glass-input w-full">
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value} className="bg-[hsl(220,25%,7%)]">{label}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <button type="submit" disabled={isPending} className="rounded-xl bg-gradient-to-r from-[#2FA4D7] to-[#2587B5] px-5 py-2.5 text-sm font-bold text-black transition-all hover:shadow-[0_0_20px_rgba(47,164,215,0.3)] active:scale-95 disabled:opacity-60">
              {isPending ? "Adding..." : "Add Skill"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-xl px-5 py-2.5 text-sm font-medium text-white/60 hover:bg-white/[0.08] transition-all">
              Cancel
            </button>
          </div>
        </form>
      )}

      {items.length === 0 && !showForm && (
        <p className="text-sm text-white/45">No skills added yet.</p>
      )}

      {grouped.map((group) => (
        <div key={group.category}>
          <p className="mb-2 text-xs font-medium text-white/45">{group.label}</p>
          <div className="flex flex-wrap gap-2">
            {group.skills.map((skill) => (
              <span key={skill.id} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-300 hover:scale-105 ${CATEGORY_COLORS[skill.category]}`}>
                {skill.name}
                {isSelf && (
                  <button type="button" onClick={() => handleRemove(skill.id)} disabled={isPending} className="ml-0.5 opacity-40 hover:opacity-100 hover:text-red-400 transition-all">
                    <X size={12} />
                  </button>
                )}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
