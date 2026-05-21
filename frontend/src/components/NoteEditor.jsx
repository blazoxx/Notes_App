import { useEffect, useState } from 'react';
import { X, Pin, PinOff, Save } from 'lucide-react';

const COLORS = ['#ffffff', '#fef3c7', '#dbeafe', '#dcfce7', '#fee2e2', '#ede9fe', '#fce7f3', '#e0f2fe'];

export default function NoteEditor({ initial, onClose, onSave }) {
  const [form, setForm] = useState({
    _id: initial._id,
    title: initial.title || '',
    content: initial.content || '',
    tags: (initial.tags || []).join(', '),
    color: initial.color || '#ffffff',
    pinned: !!initial.pinned,
  });

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const submit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave({
      ...form,
      title: form.title.trim(),
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 z-20 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden"
        style={{ backgroundColor: form.color }}
      >
        <div className="p-4 flex items-center gap-2">
          <input
            autoFocus
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="flex-1 bg-transparent outline-none text-lg font-semibold text-neutral-900 placeholder-neutral-500"
            required
          />
          <button type="button" onClick={() => setForm({ ...form, pinned: !form.pinned })} className="p-1.5 rounded hover:bg-black/10" title="Pin">
            {form.pinned ? <Pin className="w-4 h-4 fill-current text-neutral-800" /> : <PinOff className="w-4 h-4 text-neutral-700" />}
          </button>
          <button type="button" onClick={onClose} className="p-1.5 rounded hover:bg-black/10" title="Close">
            <X className="w-4 h-4 text-neutral-700" />
          </button>
        </div>
        <textarea
          rows={8}
          placeholder="Take a note…"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="w-full px-4 bg-transparent outline-none text-sm text-neutral-800 placeholder-neutral-500 resize-none"
        />
        <input
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          className="w-full px-4 py-2 bg-transparent outline-none text-sm text-neutral-800 placeholder-neutral-500 border-t border-black/10"
        />
        <div className="px-4 py-3 flex items-center justify-between border-t border-black/10 bg-black/5">
          <div className="flex items-center gap-1.5">
            {COLORS.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setForm({ ...form, color: c })}
                className={`w-6 h-6 rounded-full border ${form.color === c ? 'ring-2 ring-amber-500 border-transparent' : 'border-black/20'}`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
          <button type="submit" className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium">
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      </form>
    </div>
  );
}
