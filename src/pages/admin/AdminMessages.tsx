import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { ContactMessage } from '../../types';
import { Mail, CheckCircle2, Search, Clock, MessageCircle } from 'lucide-react';

export const AdminMessages: React.FC = () => {
  const { adminToken } = useStore();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [search, setSearch] = useState('');

  const loadMessages = async () => {
    if (!adminToken) return;
    try {
      const res = await fetch('/api/messages', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadMessages();
  }, [adminToken]);

  const toggleStatus = async (id: string, current: string) => {
    const nextStatus = current === 'unread' ? 'read' : current === 'read' ? 'replied' : 'unread';
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        await loadMessages();
      }
    } catch {
      alert('Error updating status');
    }
  };

  const filtered = messages.filter((m) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.contact.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs uppercase tracking-widest text-[#B99A5B] font-semibold block mb-1">
          Communications
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#171717]">
          Inquiries &amp; Messages ({messages.length})
        </h1>
        <p className="text-xs text-[#626262] mt-1">
          Messages received from the website contact form.
        </p>
      </div>

      <div className="bg-white p-4 border border-[#E9E6E0] rounded-sm shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#71717A]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search messages..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#E9E6E0] rounded-xs focus:border-[#B99A5B] focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((msg) => (
          <div
            key={msg.id}
            className="bg-white border border-[#E9E6E0] p-6 rounded-sm shadow-2xs flex flex-col md:flex-row md:items-start justify-between gap-6"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-serif text-lg font-semibold text-[#171717]">
                  {msg.name}
                </span>
                <span className="text-xs text-[#71717A]">({msg.contact})</span>
                <span className="text-xs text-[#B99A5B] font-semibold">• {msg.subject}</span>
              </div>
              <p className="text-xs sm:text-sm text-[#626262] leading-relaxed whitespace-pre-line bg-[#FAF8F5] p-3.5 rounded-xs border border-[#E9E6E0]/60 mb-2">
                {msg.message}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-[#71717A]">
                <Clock className="w-3 h-3" />
                <span>{new Date(msg.createdAt).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2 shrink-0">
              <button
                onClick={() => toggleStatus(msg.id, msg.status)}
                className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-xs border transition-colors ${
                  msg.status === 'unread'
                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                    : msg.status === 'replied'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-zinc-100 text-zinc-700 border-zinc-200'
                }`}
              >
                Status: {msg.status}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
