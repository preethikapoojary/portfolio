import { useEffect, useState } from 'react';
import { FiUpload, FiCheckCircle, FiTrash2, FiFileText } from 'react-icons/fi';
import { resumeApi } from '../api/endpoints';

export default function ResumePage() {
  const [versions, setVersions] = useState([]);
  const [label, setLabel] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const load = () => resumeApi.list().then((res) => setVersions(res.data));
  useEffect(() => { load(); }, []);

  const upload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      await resumeApi.upload(file, label);
      setFile(null);
      setLabel('');
      e.target.reset();
      await load();
    } catch {
      setError('Upload failed — make sure the file is a PDF under 10MB.');
    } finally {
      setUploading(false);
    }
  };

  const activate = async (id) => {
    await resumeApi.activate(id);
    await load();
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this resume version?')) return;
    try {
      await resumeApi.remove(id);
      await load();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete this version.');
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Resume</h1>
        <p className="text-sm text-muted">
          Upload new versions, choose which one is live on the public site, and remove old ones.
        </p>
      </div>

      <form onSubmit={upload} className="card space-y-4">
        <div>
          <label className="label">Label (optional)</label>
          <input
            className="input"
            placeholder="e.g. 2026 — Senior SDE version"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div>
          <label className="label">PDF file</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="text-sm"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button type="submit" disabled={!file || uploading} className="btn-primary flex items-center gap-2">
          <FiUpload /> {uploading ? 'Uploading…' : 'Upload new version'}
        </button>
      </form>

      <div className="card divide-y divide-slate-100 p-0">
        {versions.length === 0 ? (
          <p className="p-6 text-sm text-muted">No resume versions uploaded yet.</p>
        ) : (
          versions.map((v) => (
            <div key={v._id} className="flex items-center justify-between gap-3 px-5 py-3">
              <div className="flex items-center gap-3">
                <FiFileText className="text-muted" />
                <div>
                  <p className="text-sm font-medium">{v.label || 'Untitled version'}</p>
                  <p className="text-xs text-muted">{new Date(v.uploadedAt).toLocaleString()}</p>
                </div>
                {v.isActive && (
                  <span className="ml-2 flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-600">
                    <FiCheckCircle /> Active
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <a href={v.file?.url} target="_blank" rel="noreferrer" className="btn-secondary text-xs">
                  View
                </a>
                {!v.isActive && (
                  <button onClick={() => activate(v._id)} className="btn-secondary text-xs">
                    Set active
                  </button>
                )}
                {!v.isActive && (
                  <button onClick={() => remove(v._id)} className="rounded p-1.5 text-red-500 hover:bg-red-50" aria-label="Delete">
                    <FiTrash2 />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
