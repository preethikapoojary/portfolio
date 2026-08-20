import { useEffect, useState } from 'react';
import { FiMail, FiCheckCircle, FiTrash2 } from 'react-icons/fi';
import { messagesApi } from '../api/endpoints';
import Modal from '../components/ui/Modal';

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState('all'); // all | unread | read
  const [viewing, setViewing] = useState(null);

  const load = () => {
    const params = filter === 'all' ? {} : { isRead: filter === 'read' };
    messagesApi.list(params).then((res) => setMessages(res.data));
  };

  useEffect(() => { load(); }, [filter]);

  const open = async (msg) => {
    setViewing(msg);
    if (!msg.isRead) {
      const res = await messagesApi.toggleRead(msg._id);
      setMessages((prev) => prev.map((m) => (m._id === msg._id ? res.data : m)));
    }
  };

  const toggleRead = async (msg, e) => {
    e.stopPropagation();
    const res = await messagesApi.toggleRead(msg._id);
    setMessages((prev) => prev.map((m) => (m._id === msg._id ? res.data : m)));
  };

  const remove = async (msg, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this message?')) return;
    await messagesApi.remove(msg._id);
    load();
  };

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Messages</h1>
          <p className="text-sm text-muted">Contact form submissions from your public site.</p>
        </div>
        <div className="flex gap-2">
          {['all', 'unread', 'read'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-sm capitalize ${
                filter === f ? 'bg-primary/10 text-primary' : 'text-muted hover:bg-slate-100'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="card divide-y divide-slate-100 p-0">
        {messages.length === 0 ? (
          <p className="p-6 text-sm text-muted">No messages yet.</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              onClick={() => open(msg)}
              className={`flex cursor-pointer items-start gap-3 px-5 py-3 hover:bg-slate-50/60 ${
                msg.isRead ? '' : 'bg-primary/5'
              }`}
            >
              <span className="mt-1 text-muted">{msg.isRead ? <FiCheckCircle /> : <FiMail className="text-primary" />}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className={`truncate text-sm ${msg.isRead ? '' : 'font-semibold'}`}>{msg.name}</p>
                  <span className="shrink-0 text-xs text-muted">{new Date(msg.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="truncate text-xs text-muted">{msg.subject || msg.message}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  onClick={(e) => toggleRead(msg, e)}
                  className="rounded p-1.5 text-muted hover:bg-slate-100"
                  aria-label={msg.isRead ? 'Mark unread' : 'Mark read'}
                >
                  {msg.isRead ? <FiMail /> : <FiCheckCircle />}
                </button>
                <button onClick={(e) => remove(msg, e)} className="rounded p-1.5 text-red-500 hover:bg-red-50" aria-label="Delete">
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {viewing && (
        <Modal title={viewing.subject || 'Message'} onClose={() => setViewing(null)}>
          <div className="space-y-3 text-sm">
            <p><span className="text-muted">From:</span> {viewing.name} ({viewing.email})</p>
            <p className="whitespace-pre-line">{viewing.message}</p>
            <p className="text-xs text-muted">{new Date(viewing.createdAt).toLocaleString()}</p>
          </div>
        </Modal>
      )}
    </div>
  );
}
