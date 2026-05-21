import { useEffect, useMemo, useState } from 'react';
import { LogOut, Moon, Sun, Plus, Search, StickyNote } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import NoteCard from '../components/NoteCard.jsx';
import NoteEditor from '../components/NoteEditor.jsx';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const [notes, setNotes] = useState([]);
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState(null); // note or {} for new
  const [loading, setLoading] = useState(true);

  const load = async (query = '') => {
    setLoading(true);
    try {
      const { data } = await api.get('/notes', { params: query ? { q: query } : {} });
      setNotes(data);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);
  useEffect(() => {
    const t = setTimeout(() => load(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  const save = async (payload) => {
    try {
      if (payload._id) {
        const { data } = await api.put(`/notes/${payload._id}`, payload);
        setNotes((prev) => sortNotes(prev.map((n) => (n._id === data._id ? data : n))));
        toast.success('Updated');
      } else {
        const { data } = await api.post('/notes', payload);
        setNotes((prev) => sortNotes([data, ...prev]));
        toast.success('Created');
      }
      setEditing(null);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Save failed');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this note?')) return;
    try {
      await api.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((n) => n._id !== id));
      toast.success('Deleted');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Delete failed');
    }
  };

  const togglePin = async (id) => {
    try {
      const { data } = await api.patch(`/notes/${id}/pin`);
      setNotes((prev) => sortNotes(prev.map((n) => (n._id === id ? data : n))));
    } catch (e) {
      toast.error(e.response?.data?.message || 'Pin failed');
    }
  };

  const { pinned, others } = useMemo(() => ({
    pinned: notes.filter((n) => n.pinned),
    others: notes.filter((n) => !n.pinned),
  }), [notes]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <StickyNote className="w-6 h-6 text-amber-500" />
          <h1 className="text-lg font-semibold text-neutral-900 dark:text-white mr-2">Notes</h1>
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title, content, tags…"
              className="w-full pl-9 pr-3 py-2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <button onClick={toggle} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200" title="Toggle theme">
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <span className="hidden sm:inline text-sm text-neutral-500 dark:text-neutral-400">{user?.name}</span>
          <button onClick={logout} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200" title="Logout">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <button
          onClick={() => setEditing({})}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
        >
          <Plus className="w-4 h-4" /> New note
        </button>

        {loading ? (
          <p className="text-neutral-500 dark:text-neutral-400">Loading…</p>
        ) : notes.length === 0 ? (
          <p className="text-neutral-500 dark:text-neutral-400">No notes yet. Create your first one.</p>
        ) : (
          <>
            {pinned.length > 0 && (
              <Section title="Pinned">
                <Grid>
                  {pinned.map((n) => (
                    <NoteCard key={n._id} note={n} onEdit={() => setEditing(n)} onDelete={() => remove(n._id)} onPin={() => togglePin(n._id)} />
                  ))}
                </Grid>
              </Section>
            )}
            <Section title={pinned.length ? 'Others' : 'All notes'}>
              <Grid>
                {others.map((n) => (
                  <NoteCard key={n._id} note={n} onEdit={() => setEditing(n)} onDelete={() => remove(n._id)} onPin={() => togglePin(n._id)} />
                ))}
              </Grid>
            </Section>
          </>
        )}
      </main>

      {editing && (
        <NoteEditor initial={editing} onClose={() => setEditing(null)} onSave={save} />
      )}
    </div>
  );
}

const Section = ({ title, children }) => (
  <section className="mb-8">
    <h2 className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">{title}</h2>
    {children}
  </section>
);

const Grid = ({ children }) => (
  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{children}</div>
);

function sortNotes(arr) {
  return [...arr].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });
}
