'use client';

import { useCallback, useEffect, useState } from 'react';
import slugify from 'slugify';
import { CATEGORY_OPTIONS, type ContactMessage, type Project } from '@/types/gallery';

type TabId = 'photo' | 'project' | 'contact' | 'settings';

function getAuthHeader(): string {
  const login = sessionStorage.getItem('adminLogin') ?? '';
  return `Basic ${btoa(login)}`;
}

function saveLogin(value: string) {
  sessionStorage.setItem('adminLogin', value);
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabId>('photo');
  const [loginInput, setLoginInput] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cacheSlug, setCacheSlug] = useState('');

  const showStatus = (message: string) => {
    setStatus(message);
    setTimeout(() => setStatus(null), 4000);
  };

  const loadProjects = useCallback(async () => {
    const res = await fetch('/api/projects');
    if (res.ok) {
      setProjects(await res.json());
    }
  }, []);

  const loadContacts = useCallback(async () => {
    const res = await fetch('/api/contact', {
      headers: { Authorization: getAuthHeader() }
    });
    if (res.ok) {
      setContacts(await res.json());
    }
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem('adminLogin');
    if (saved) {
      setLoginInput(saved);
    }
    loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    if (activeTab === 'contact') {
      loadContacts();
    }
  }, [activeTab, loadContacts]);

  const handleLoginKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      saveLogin(loginInput);
      showStatus('Giriş bilgileri kaydedildi.');
      if (activeTab === 'contact') {
        loadContacts();
      }
    }
  };

  const handlePhotoUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);

    try {
      const res = await fetch('/api/photo/upload', {
        method: 'POST',
        headers: { Authorization: getAuthHeader() },
        body: formData
      });

      if (res.ok) {
        showStatus('Fotoğraf başarıyla yüklendi.');
        event.currentTarget.reset();
      } else {
        showStatus('Fotoğraf yüklenemedi.');
      }
    } catch {
      showStatus('Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const title = String(formData.get('title') ?? '');
    formData.set('slug', slugify(title, { lower: true, strict: true, trim: true }));
    formData.set('homePage', (event.currentTarget.elements.namedItem('homePage') as HTMLInputElement).checked ? 'true' : 'false');

    try {
      const res = await fetch('/api/projects/upload', {
        method: 'POST',
        headers: { Authorization: getAuthHeader() },
        body: formData
      });

      if (res.ok) {
        showStatus('Proje başarıyla yüklendi.');
        event.currentTarget.reset();
        loadProjects();
      } else {
        showStatus('Proje yüklenemedi.');
      }
    } catch {
      showStatus('Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const clearCache = async (slug?: string) => {
    const url = slug ? `/api/cache?slug=${encodeURIComponent(slug)}` : '/api/cache';
    const res = await fetch(url, {
      headers: { Authorization: getAuthHeader() }
    });

    if (res.ok) {
      showStatus(slug ? 'Proje önbelleği temizlendi.' : 'Ana sayfa önbelleği temizlendi.');
    } else {
      showStatus('Önbellek temizlenemedi. Giriş bilgilerini kontrol edin.');
    }
  };

  const tabs: { id: TabId; label: string }[] = [
    { id: 'photo', label: 'Fotoğraf Yükleme' },
    { id: 'project', label: 'Proje Yükleme' },
    { id: 'contact', label: 'Contact Me' },
    { id: 'settings', label: 'Ayarlar' }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <header className="mb-8 flex flex-col gap-4 border-b border-zinc-800 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-light tracking-wide">BsGallery Admin</h1>
            <p className="mt-1 text-sm text-zinc-400">Proje ve fotoğraf yönetimi</p>
          </div>
          <input
            type="text"
            value={loginInput}
            onChange={(e) => setLoginInput(e.target.value)}
            onKeyDown={handleLoginKeyDown}
            placeholder="username,password"
            className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm sm:w-72"
          />
        </header>

        {status && (
          <div className="mb-4 rounded border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-200">{status}</div>
        )}

        <div className="mb-6 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded px-4 py-2 text-sm transition ${
                activeTab === tab.id ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'photo' && (
          <form onSubmit={handlePhotoUpload} className="grid gap-4 rounded border border-zinc-800 bg-zinc-900/50 p-6">
            <FormField label="Fotoğraf">
              <input type="file" name="file" required accept="image/*" className="w-full text-sm" />
            </FormField>
            <FormField label="Proje">
              <select name="projectsId" required className="admin-input">
                <option value="">Proje seçin</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Başlık">
              <input name="title" required className="admin-input" />
            </FormField>
            <FormField label="Alt Başlık">
              <input name="subtitle" className="admin-input" />
            </FormField>
            <FormField label="Açıklama">
              <textarea name="description" rows={4} className="admin-input" />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Konum">
                <input name="location" className="admin-input" />
              </FormField>
              <FormField label="Şehir">
                <input name="city" className="admin-input" />
              </FormField>
            </div>
            <FormField label="Kategori">
              <select name="category" required className="admin-input">
                <option value="">Kategori seçin</option>
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Fotoğrafçı">
              <input name="photographer" className="admin-input" />
            </FormField>
            <button type="submit" disabled={loading} className="admin-button">
              {loading ? 'Yükleniyor...' : 'Fotoğraf Yükle'}
            </button>
          </form>
        )}

        {activeTab === 'project' && (
          <form onSubmit={handleProjectUpload} className="grid gap-4 rounded border border-zinc-800 bg-zinc-900/50 p-6">
            <FormField label="Proje Fotoğrafı">
              <input type="file" name="file" required accept="image/*" className="w-full text-sm" />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Müşteri">
                <input name="client" required className="admin-input" />
              </FormField>
              <FormField label="Kamera">
                <input name="camera" required className="admin-input" />
              </FormField>
            </div>
            <FormField label="Başlık">
              <input name="title" required className="admin-input" />
            </FormField>
            <FormField label="Açıklama">
              <textarea name="description" rows={5} className="admin-input" />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Şehir">
                <input name="city" className="admin-input" />
              </FormField>
              <FormField label="Fotoğrafçı">
                <input name="photographer" className="admin-input" />
              </FormField>
            </div>
            <FormField label="Kategori">
              <select name="category" required className="admin-input">
                <option value="">Kategori seçin</option>
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Durum">
              <select name="status" required className="admin-input">
                <option value="0">Active</option>
                <option value="1">Inactive</option>
              </select>
            </FormField>
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input type="checkbox" name="homePage" id="homePage" className="rounded" />
              Anasayfada göster
            </label>
            <button type="submit" disabled={loading} className="admin-button">
              {loading ? 'Yükleniyor...' : 'Proje Yükle'}
            </button>
          </form>
        )}

        {activeTab === 'contact' && (
          <div className="overflow-x-auto rounded border border-zinc-800">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-zinc-900 text-zinc-400">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Message</th>
                  <th className="px-4 py-3">Created</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact.id} className="border-t border-zinc-800">
                    <td className="px-4 py-3">{contact.id}</td>
                    <td className="px-4 py-3">{contact.name}</td>
                    <td className="px-4 py-3">
                      <a href={`mailto:${contact.email}`} className="text-zinc-300 underline">
                        {contact.email}
                      </a>
                    </td>
                    <td className="px-4 py-3">{contact.subject}</td>
                    <td className="max-w-xs truncate px-4 py-3">{contact.message}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{new Date(contact.created).toLocaleString('tr-TR')}</td>
                  </tr>
                ))}
                {contacts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                      Mesaj bulunamadı veya giriş gerekli.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="grid gap-4 rounded border border-zinc-800 bg-zinc-900/50 p-6">
            <button type="button" onClick={() => clearCache()} className="admin-button-danger">
              Ana Sayfa Önbelleğini Temizle
            </button>
            <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
              <FormField label="Proje Slug">
                <select value={cacheSlug} onChange={(e) => setCacheSlug(e.target.value)} className="admin-input">
                  <option value="">Proje seçin</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.slug}>
                      {project.title}
                    </option>
                  ))}
                </select>
              </FormField>
              <button type="button" onClick={() => cacheSlug && clearCache(cacheSlug)} className="admin-button-danger">
                Proje Önbelleğini Temizle
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .admin-input {
          width: 100%;
          border-radius: 0.25rem;
          border: 1px solid rgb(63 63 70);
          background: rgb(24 24 27);
          padding: 0.625rem 0.75rem;
          font-size: 0.875rem;
          color: rgb(244 244 245);
        }
        .admin-button {
          border-radius: 0.25rem;
          background: white;
          padding: 0.625rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: black;
        }
        .admin-button:disabled {
          opacity: 0.6;
        }
        .admin-button-danger {
          border-radius: 0.25rem;
          background: rgb(127 29 29);
          padding: 0.625rem 1rem;
          font-size: 0.875rem;
          color: white;
        }
      `}</style>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-zinc-400">{label}</span>
      {children}
    </label>
  );
}
