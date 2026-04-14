"use client";

import {
  ExperienceDTO,
  addExperienceAction,
  deleteExperienceAction,
  updateExperienceAction,
} from "@/lib/actions/experience";
import { ExperienceType } from "@/models/experience.model";
import { Briefcase, Code, FlaskConical, HandHeart, Pencil, Plus, Trash2, X, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { toast } from "sonner";

const TYPE_LABELS: Record<ExperienceType, string> = {
  work: "Work", project: "Project", research: "Research", volunteer: "Volunteer",
};

const TYPE_ICONS: Record<ExperienceType, typeof Briefcase> = {
  work: Briefcase, project: Code, research: FlaskConical, volunteer: HandHeart,
};

const TYPE_COLORS: Record<ExperienceType, string> = {
  work: "bg-[#2FA4D7]/[0.08] text-[#2FA4D7]/85",
  project: "bg-[#2FA4D7]/[0.08] text-[#2FA4D7]/85",
  research: "bg-[#E76F2E]/[0.08] text-[#E76F2E]/85",
  volunteer: "bg-[#F5E9D8]/[0.08] text-amber-400/70",
};

function formatDate(iso: string | null) {
  if (!iso) return "Present";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function ExperienceForm({ initial, onClose }: { initial?: ExperienceDTO; onClose: () => void }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [skills, setSkills] = useState<string[]>(initial?.skills || []);
  const [skillInput, setSkillInput] = useState("");

  function addSkill() {
    const s = skillInput.trim().slice(0, 50);
    if (s && skills.length < 10 && !skills.includes(s)) setSkills([...skills, s]);
    setSkillInput("");
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const current = fd.get("current") === "on";
    const input = {
      type: (fd.get("type") as ExperienceType) || "project",
      title: String(fd.get("title") || "").trim(),
      organization: String(fd.get("organization") || "").trim(),
      startDate: String(fd.get("startDate") || ""),
      endDate: current ? undefined : String(fd.get("endDate") || "") || undefined,
      current,
      description: String(fd.get("description") || "").trim(),
      skills,
      media: initial?.media || [],
      projectUrl: String(fd.get("projectUrl") || "").trim(),
    };

    startTransition(async () => {
      try {
        if (initial) {
          await updateExperienceAction(initial.id, input);
          toast.success("Experience updated.");
        } else {
          await addExperienceAction(input);
          toast.success("Experience added.");
        }
        router.refresh();
        onClose();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="glass-panel rounded-2xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-display font-bold text-foreground">{initial ? "Edit Experience" : "Add Experience"}</h3>
        <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/[0.05] text-white/55 transition-all">
          <X size={16} />
        </button>
      </div>
      <select name="type" defaultValue={initial?.type || "project"} className="glass-input w-full">
        {Object.entries(TYPE_LABELS).map(([value, label]) => (
          <option key={value} value={value} className="bg-[hsl(220,25%,7%)]">{label}</option>
        ))}
      </select>
      <input name="title" defaultValue={initial?.title} placeholder="Title *" required className="glass-input w-full" />
      <input name="organization" defaultValue={initial?.organization} placeholder="Organization / Company" className="glass-input w-full" />
      <div className="grid grid-cols-2 gap-3">
        <input name="startDate" type="month" defaultValue={initial?.startDate?.slice(0, 7)} required className="glass-input" />
        <input name="endDate" type="month" defaultValue={initial?.endDate?.slice(0, 7) || ""} className="glass-input" />
      </div>
      <label className="flex items-center gap-2 text-sm text-white/60">
        <input type="checkbox" name="current" defaultChecked={initial?.current} className="rounded border-white/20 bg-white/[0.08]" />
        Currently working here
      </label>
      <textarea name="description" defaultValue={initial?.description} placeholder="Description" maxLength={1000} rows={4} className="glass-input w-full resize-none" />
      <input name="projectUrl" defaultValue={initial?.projectUrl} placeholder="Project URL" className="glass-input w-full" />
      <div>
        <p className="text-xs font-medium text-white/65 mb-1">Skills ({skills.length}/10)</p>
        <div className="flex gap-2">
          <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }} placeholder="Add a skill" className="glass-input flex-1" />
          <button type="button" onClick={addSkill} className="rounded-xl bg-white/[0.08] border border-white/[0.1] px-3 py-2 text-sm font-medium text-white/65 hover:bg-white/[0.08] transition-all">Add</button>
        </div>
        {skills.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <span key={s} className="inline-flex items-center gap-1 rounded-full bg-[#2FA4D7]/[0.08] border border-[#2FA4D7]/10 px-2.5 py-1 text-xs font-medium text-[#2FA4D7]/85">
                {s}
                <button type="button" onClick={() => setSkills(skills.filter((x) => x !== s))} className="hover:text-red-400 transition-colors">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      <button type="submit" disabled={isPending} className="rounded-xl bg-gradient-to-r from-[#2FA4D7] to-[#2587B5] px-5 py-2.5 text-sm font-bold text-black transition-all hover:shadow-[0_0_20px_rgba(47,164,215,0.3)] active:scale-95 disabled:opacity-60">
        {isPending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}

export default function ExperienceSection({ items, isSelf }: { items: ExperienceDTO[]; isSelf: boolean }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    startTransition(async () => {
      try {
        await deleteExperienceAction(id);
        router.refresh();
        toast.success("Experience removed.");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to delete.");
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55">Experience</h2>
        {isSelf && (
          <button onClick={() => { setShowForm(true); setEditingId(null); }} className="rounded-lg p-1.5 text-white/55 hover:bg-white/[0.05] hover:text-white/60 transition-all">
            <Plus size={18} />
          </button>
        )}
      </div>

      {showForm && !editingId && <ExperienceForm onClose={() => setShowForm(false)} />}

      {items.length === 0 && !showForm && (
        <p className="text-sm text-white/45">No experience entries yet.</p>
      )}

      {items.map((item) =>
        editingId === item.id ? (
          <ExperienceForm key={item.id} initial={item} onClose={() => setEditingId(null)} />
        ) : (
          <div key={item.id} className="flex gap-3 glass-panel rounded-2xl p-5 hover-card-glow transition-all duration-500">
            {(() => {
              const Icon = TYPE_ICONS[item.type];
              return (
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${TYPE_COLORS[item.type]}`}>
                  <Icon size={20} />
                </div>
              );
            })()}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-foreground">{item.title}</h3>
                <span className="rounded-full bg-white/[0.08] border border-white/[0.1] px-2 py-0.5 text-xs text-white/55">{TYPE_LABELS[item.type]}</span>
              </div>
              {item.organization && <p className="text-sm text-white/60">{item.organization}</p>}
              <p className="text-xs text-white/45">{formatDate(item.startDate)} - {item.current ? "Present" : formatDate(item.endDate)}</p>
              {item.description && <p className="mt-2 text-sm text-white/55">{item.description}</p>}
              {item.skills.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {item.skills.map((s) => (
                    <span key={s} className="rounded-full bg-[#2FA4D7]/[0.06] border border-[#2FA4D7]/10 px-2 py-0.5 text-xs font-medium text-[#2FA4D7]/80">{s}</span>
                  ))}
                </div>
              )}
              {item.projectUrl && (
                <Link href={item.projectUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs text-[#2FA4D7]/80 hover:text-[#2FA4D7] transition-colors">
                  View Project <ExternalLink size={12} />
                </Link>
              )}
            </div>
            {isSelf && (
              <div className="flex gap-1">
                <button onClick={() => setEditingId(item.id)} disabled={isPending} className="rounded-lg p-1.5 text-white/45 hover:bg-white/[0.05] hover:text-white/65 transition-all">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(item.id)} disabled={isPending} className="rounded-lg p-1.5 text-white/45 hover:bg-red-500/10 hover:text-red-400 transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}
