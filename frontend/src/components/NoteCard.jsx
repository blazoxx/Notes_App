import { Pin, PinOff, Trash2, Pencil } from 'lucide-react';

export default function NoteCard({ note, onEdit, onDelete, onPin }) {
  const isLight = isColorLight(note.color);
  return (
    <div
      className="rounded-xl p-4 border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col"
      style={{ backgroundColor: note.color || '#ffffff', color: isLight ? '#1f2937' : '#f9fafb' }}
      onClick={onEdit}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold leading-snug break-words">{note.title}</h3>
        <button
          onClick={(e) => { e.stopPropagation(); onPin(); }}
          className="opacity-70 hover:opacity-100"
          title={note.pinned ? 'Unpin' : 'Pin'}
        >
          {note.pinned ? <Pin className="w-4 h-4 fill-current" /> : <PinOff className="w-4 h-4" />}
        </button>
      </div>
      {note.content && (
        <p className="text-sm whitespace-pre-wrap break-words line-clamp-[10] flex-1">{note.content}</p>
      )}
      {note.tags?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {note.tags.map((t) => (
            <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10">
              #{t}
            </span>
          ))}
        </div>
      )}
      <div className="mt-3 flex justify-end gap-1 opacity-70">
        <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10" title="Edit">
          <Pencil className="w-4 h-4" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10" title="Delete">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function isColorLight(hex = '#ffffff') {
  const c = hex.replace('#', '');
  if (c.length !== 6) return true;
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
}
