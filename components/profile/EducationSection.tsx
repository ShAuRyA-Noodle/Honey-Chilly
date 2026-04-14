"use client";

import { EducationDTO } from "@/lib/actions/education";
import {
  addEducationAction,
  deleteEducationAction,
  updateEducationAction,
} from "@/lib/actions/education";
import { GraduationCap, Pencil, Plus, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { toast } from "sonner";

function formatDate(iso: string | null) {
  if (!iso) return "Present";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function EducationForm({ initial, onClose }: { initial?: EducationDTO; onClose: () => void }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const current = formData.get("current") === "on";
    formData.set("current", current ? "true" : "false");

    startTransition(async () => {
      try {
        if (initial) {
          await updateEducationAction(initial.id, formData);
          toast.success("Education updated.");
        } else {
          await addEducationAction(formData);
          toast.success("Education added.");
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
        <h3 className="text-sm font-display font-bold text-foreground">{initial ? "Edit Education" : "Add Education"}</h3>
        <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/[0.05] text-white/55 transition-all">
          <X size={16} />
        </button>
      </div>
      <input name="institution" defaultValue={initial?.institution} placeholder="Institution *" required className="glass-input w-full" />
      <div className="grid grid-cols-2 gap-3">
        <input name="degree" defaultValue={initial?.degree} placeholder="Degree" className="glass-input" />
        <input name="fieldOfStudy" defaultValue={initial?.fieldOfStudy} placeholder="Field of Study" className="glass-input" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input name="startDate" type="month" defaultValue={initial?.startDate?.slice(0, 7)} required className="glass-input" />
        <input name="endDate" type="month" defaultValue={initial?.endDate?.slice(0, 7) || ""} className="glass-input" />
      </div>
      <label className="flex items-center gap-2 text-sm text-white/60">
        <input type="checkbox" name="current" defaultChecked={initial?.current} className="rounded border-white/20 bg-white/[0.04]" />
        Currently enrolled
      </label>
      <input name="grade" defaultValue={initial?.grade} placeholder="Grade / GPA" className="glass-input w-full" />
      <textarea name="description" defaultValue={initial?.description} placeholder="Description" maxLength={500} rows={3} className="glass-input w-full resize-none" />
      <button type="submit" disabled={isPending} className="rounded-xl bg-gradient-to-r from-[#2FA4D7] to-[#2587B5] px-5 py-2.5 text-sm font-bold text-black transition-all hover:shadow-[0_0_20px_rgba(47,164,215,0.3)] active:scale-95 disabled:opacity-60">
        {isPending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}

export default function EducationSection({ items, isSelf }: { items: EducationDTO[]; isSelf: boolean }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    startTransition(async () => {
      try {
        await deleteEducationAction(id);
        router.refresh();
        toast.success("Education removed.");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to delete.");
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55">Education</h2>
        {isSelf && (
          <button onClick={() => { setShowForm(true); setEditingId(null); }} className="rounded-lg p-1.5 text-white/55 hover:bg-white/[0.05] hover:text-white/60 transition-all">
            <Plus size={18} />
          </button>
        )}
      </div>

      {showForm && !editingId && <EducationForm onClose={() => setShowForm(false)} />}

      {items.length === 0 && !showForm && (
        <p className="text-sm text-white/45">No education entries yet.</p>
      )}

      {items.map((item) =>
        editingId === item.id ? (
          <EducationForm key={item.id} initial={item} onClose={() => setEditingId(null)} />
        ) : (
          <div key={item.id} className="flex gap-3 glass-panel rounded-2xl p-5 hover-card-glow transition-all duration-500">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E76F2E]/[0.08]">
              <GraduationCap size={20} className="text-[#E76F2E]/85" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-foreground">{item.institution}</h3>
              {(item.degree || item.fieldOfStudy) && (
                <p className="text-sm text-white/60">{[item.degree, item.fieldOfStudy].filter(Boolean).join(", ")}</p>
              )}
              <p className="text-xs text-white/45">{formatDate(item.startDate)} - {item.current ? "Present" : formatDate(item.endDate)}</p>
              {item.grade && <p className="text-xs text-white/45">Grade: {item.grade}</p>}
              {item.description && <p className="mt-2 text-sm text-white/55">{item.description}</p>}
            </div>
            {isSelf && (
              <div className="flex gap-1">
                <button onClick={() => setEditingId(item.id)} disabled={isPending} className="rounded-lg p-1.5 text-white/45 hover:bg-white/[0.05] hover:text-white/50 transition-all">
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
