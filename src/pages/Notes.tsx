import React, { useState } from 'react';
import { Plus, Trash2, StickyNote, Check } from 'lucide-react';
import { Header } from '../components/Header';
import { useApp } from '../context/AppContext';
import { ShopNote } from '../types';

export const Notes: React.FC = () => {
  const { notes, addNote, toggleNote, deleteNote, activeShop } = useApp();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !activeShop) return;

    await addNote({
      title: title.trim(),
      content: content.trim(),
      date: new Date().toLocaleDateString(),
      completed: false,
      shopId: activeShop.id
    });

    setTitle('');
    setContent('');
    setIsAdding(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between pb-12">
      <Header title="Shop Memos & Notes" showBack={true} />

      <main className="max-w-lg mx-auto w-full p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Quick Shop Scratchpad</h2>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="px-3 py-1.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition"
          >
            <Plus size={14} />
            <span>New Note</span>
          </button>
        </div>

        {isAdding && (
          <form onSubmit={handleAdd} className="bg-white rounded-2xl p-5 shadow-md border border-amber-200 space-y-3 animate-fadeIn">
            <input
              type="text"
              required
              placeholder="Note Title / Subject"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
            />
            <textarea
              rows={3}
              placeholder="Write note or reminder details..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium resize-none"
            />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 py-2 bg-forest-700 text-white rounded-xl text-xs font-bold shadow">
                Save Note
              </button>
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold">
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="space-y-2.5">
          {notes.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500">
              <StickyNote size={36} className="mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-bold">No Notes Created</p>
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className={`bg-white p-4 rounded-2xl border shadow-sm flex items-start justify-between gap-3 ${
                  note.completed ? 'opacity-60 border-slate-200 bg-slate-50/50' : 'border-amber-200/80 bg-amber-50/20'
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <button
                    onClick={() => toggleNote(note.id)}
                    className={`w-5 h-5 rounded-md border mt-0.5 flex items-center justify-center transition ${
                      note.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                    }`}
                  >
                    {note.completed && <Check size={12} />}
                  </button>
                  <div className="flex-1">
                    <h4 className={`text-xs font-bold text-slate-900 ${note.completed ? 'line-through text-slate-400' : ''}`}>
                      {note.title}
                    </h4>
                    {note.content && (
                      <p className="text-xs text-slate-600 mt-1 whitespace-pre-line">{note.content}</p>
                    )}
                    <span className="text-[10px] text-slate-400 block mt-2">{note.date}</span>
                  </div>
                </div>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};
