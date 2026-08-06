'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import slugify from 'slugify';
import { getImageUrl as buildImageUrl } from '@/config/config';
import { CATEGORY_OPTIONS, type ContactMessage, type Photo, type Project } from '@/types/gallery';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type SectionId = 'projects' | 'messages' | 'settings';
type OptionGroup = 'photographer' | 'client' | 'camera' | 'city';

/**
 * Bazı alanlar (kapak görseli, thumbnail vb.) mevcut `@/types/gallery`
 * tanımında olmayabilir. Backend'in döndürdüğü gerçek alan adlarına göre
 * bu iki tipi güncelleyin (örn. `image`, `thumbnailUrl`, `path`...).
 */
type ProjectRecord = Project & {
  image?: string;
  thumbnailUrl?: string;
  path?: string;
};

type PhotoRecord = Photo & {
  image?: string;
  thumbnailUrl?: string;
  path?: string;
};

type ModalState =
  | { type: 'project-form'; mode: 'add' }
  | { type: 'project-form'; mode: 'edit'; project: ProjectRecord }
  | { type: 'photo-form'; mode: 'add'; projectId: string | number }
  | { type: 'photo-form'; mode: 'edit'; photo: PhotoRecord }
  | { type: 'login' }
  | { type: 'confirm-delete'; target: 'project' | 'photo' | 'message'; id: string | number; label: string }
  | null;

type ToastTone = 'info' | 'success' | 'error';

/* ------------------------------------------------------------------ */
/*  Auth helpers                                                       */
/* ------------------------------------------------------------------ */

function parseLoginValue(value: string): { username: string; password: string } {
  const trimmed = value.trim();
  if (!trimmed) return { username: '', password: '' };

  const colonIndex = trimmed.indexOf(':');
  if (colonIndex !== -1) {
    return { username: trimmed.slice(0, colonIndex), password: trimmed.slice(colonIndex + 1) };
  }

  const commaIndex = trimmed.indexOf(',');
  if (commaIndex !== -1) {
    return { username: trimmed.slice(0, commaIndex), password: trimmed.slice(commaIndex + 1) };
  }

  return { username: trimmed, password: '' };
}

function getAuthHeader(): string {
  const login = sessionStorage.getItem('adminLogin') ?? '';
  const { username, password } = parseLoginValue(login);
  if (username && password) return `Basic ${btoa(`${username}:${password}`)}`;
  return `Basic ${btoa(login)}`;
}

function saveLogin(value: string) {
  sessionStorage.setItem('adminLogin', value);
}

function getImageUrl(record: ProjectRecord | PhotoRecord | undefined): string | null {
  if (!record) return null;
  const key =
    ('mainImageUrl' in record ? record.mainImageUrl : null) ??
    ('photoUrl' in record ? record.photoUrl : null) ??
    record.image ??
    record.thumbnailUrl ??
    record.path;
  if (!key) return null;
  if (key.startsWith('/') || key.startsWith('http')) return key;
  return buildImageUrl(key);
}

/* ------------------------------------------------------------------ */
/*  Icons (inline, no extra dependency)                                 */
/* ------------------------------------------------------------------ */

function Icon({ path, className = 'h-4 w-4' }: { path: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={path} />
    </svg>
  );
}

const paths = {
  plus: 'M12 5v14M5 12h14',
  edit: 'M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z',
  trash: 'M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m-9 0v14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6H7Z',
  back: 'M19 12H5M12 19l-7-7 7-7',
  x: 'M18 6 6 18M6 6l12 12',
  image: 'M4 4h16v16H4zM4 15l4.5-4.5L12 14l3-3 5 5M9 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z',
  mail: 'M4 4h16v16H4z M4 6l8 7 8-7',
  user: 'M20 21a8 8 0 1 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  broom: 'M9 17 4.5 21.5M3 21l6.5-6.5m2.5-2.5L21 3l-3 9-8.5 8.5-2.5-2.5Z',
  check: 'M20 6 9 17l-5-5',
  lock: 'M6 10V7a6 6 0 0 1 12 0v3m-13 0h14v11H5V10Z',
  home: 'M3 11.5 12 4l9 7.5M5.5 10v9.5h5V14h3v5.5h5V10'
};

/* ------------------------------------------------------------------ */
/*  Small shared UI                                                     */
/* ------------------------------------------------------------------ */

function Badge({ tone, children }: { tone: 'active' | 'inactive'; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] ${
        tone === 'active' ? 'border-emerald-800/60 bg-emerald-950/40 text-emerald-400' : 'border-stone-700 bg-stone-900 text-stone-500'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${tone === 'active' ? 'bg-emerald-400' : 'bg-stone-600'}`} />
      {children}
    </span>
  );
}

function IconButton({
  icon,
  label,
  onClick,
  tone = 'default',
  type = 'button'
}: {
  icon: string;
  label: string;
  onClick?: () => void;
  tone?: 'default' | 'danger';
  type?: 'button' | 'submit';
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md border transition ${
        tone === 'danger'
          ? 'border-red-900/50 text-red-400 hover:border-red-800 hover:bg-red-950/40'
          : 'border-stone-800 text-stone-400 hover:border-stone-600 hover:bg-stone-800 hover:text-stone-100'
      }`}
    >
      <Icon path={paths[icon as keyof typeof paths]} />
    </button>
  );
}

function PrimaryButton({
  children,
  onClick,
  type = 'button',
  icon,
  disabled,
  full
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  icon?: string;
  disabled?: boolean;
  full?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-md bg-amber-500 px-4 py-2.5 text-sm font-semibold text-stone-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50 ${
        full ? 'w-full' : ''
      }`}
    >
      {icon && <Icon path={paths[icon as keyof typeof paths]} className="h-4 w-4" />}
      {children}
    </button>
  );
}

function GhostButton({ children, onClick, icon }: { children: React.ReactNode; onClick?: () => void; icon?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-md border border-stone-800 px-3.5 py-2 text-sm font-medium text-stone-300 transition hover:border-stone-600 hover:bg-stone-900"
    >
      {icon && <Icon path={paths[icon as keyof typeof paths]} className="h-4 w-4" />}
      {children}
    </button>
  );
}

function Switch({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      title={label}
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition ${
        checked ? 'border-amber-500 bg-amber-500' : 'border-stone-700 bg-stone-800'
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-stone-950 transition ${checked ? 'translate-x-4' : 'translate-x-1'}`}
      />
    </button>
  );
}

function EmptyState({ icon, title, hint }: { icon: string; title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-stone-800 px-6 py-16 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-stone-800 text-stone-600">
        <Icon path={paths[icon as keyof typeof paths]} className="h-5 w-5" />
      </div>
      <p className="text-sm font-medium text-stone-300">{title}</p>
      {hint && <p className="max-w-xs text-xs text-stone-500">{hint}</p>}
    </div>
  );
}

function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 px-4 py-8 backdrop-blur-sm">
      <div className={`w-full ${wide ? 'max-w-2xl' : 'max-w-md'} rounded-lg border border-stone-800 bg-stone-950 shadow-2xl`}>
        <div className="flex items-center justify-between border-b border-stone-800 px-5 py-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-stone-200">{title}</h3>
          <IconButton icon="x" label="Kapat" onClick={onClose} />
        </div>
        <div className="max-h-[75vh] overflow-y-auto px-5 py-5">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="text-xs font-medium uppercase tracking-[0.08em] text-stone-500">
        {label} {required && <span className="text-amber-500">*</span>}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  'w-full rounded-md border border-stone-800 bg-stone-900 px-3 py-2.5 text-sm text-stone-100 outline-none transition focus:border-amber-600 focus:ring-1 focus:ring-amber-600/40';

function ComboField({
  label,
  name,
  group,
  options,
  defaultValue,
  onAdd
}: {
  label: string;
  name: string;
  group: OptionGroup;
  options: string[];
  defaultValue?: string;
  onAdd: (group: OptionGroup, value: string) => Promise<boolean>;
}) {
  const [value, setValue] = useState(defaultValue ?? '');

  return (
    <Field label={label}>
      <div className="flex gap-2">
        <input
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          list={`${group}-options`}
          className={inputClass}
          placeholder="Seçin veya yeni değer yazın"
        />
        <button
          type="button"
          onClick={async () => {
            const added = await onAdd(group, value);
            if (added) setValue(value.trim());
          }}
          className="shrink-0 rounded-md border border-stone-800 px-3 text-xs font-medium text-stone-300 hover:border-stone-600 hover:bg-stone-900"
        >
          Kaydet
        </button>
      </div>
      <datalist id={`${group}-options`}>
        {options.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>
    </Field>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function AdminPage() {
  const [section, setSection] = useState<SectionId>('projects');
  const [selectedProjectId, setSelectedProjectId] = useState<string | number | null>(null);

  const [loginInput, setLoginInput] = useState('');
  const [isAuthed, setIsAuthed] = useState(false);

  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [photos, setPhotos] = useState<PhotoRecord[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [fieldOptions, setFieldOptions] = useState<Record<OptionGroup, string[]>>({
    photographer: [],
    client: [],
    camera: [],
    city: []
  });

  const [toast, setToast] = useState<{ message: string; tone: ToastTone } | null>(null);
  const [loadingList, setLoadingList] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modal, setModal] = useState<ModalState>(null);
  const [cacheSlug, setCacheSlug] = useState('');

  const showToast = (message: string, tone: ToastTone = 'info') => {
    setToast({ message, tone });
    setTimeout(() => setToast(null), 4000);
  };

  /* -------------------------- data loading -------------------------- */

  const loadProjects = useCallback(async () => {
    const res = await fetch('/api/projects?all=1', { headers: { Authorization: getAuthHeader() } });
    if (res.ok) setProjects(await res.json());
  }, []);

  const loadPhotos = useCallback(async () => {
    const res = await fetch('/api/photo');
    if (res.ok) setPhotos(await res.json());
  }, []);

  const loadContacts = useCallback(async () => {
    const res = await fetch('/api/contact', { headers: { Authorization: getAuthHeader() } });
    if (res.ok) setContacts(await res.json());
  }, []);

  const loadFieldOptions = useCallback(async () => {
    const groups: OptionGroup[] = ['photographer', 'client', 'camera', 'city'];
    const results = await Promise.all(
      groups.map(async (group): Promise<[OptionGroup, string[]]> => {
        const res = await fetch(`/api/admin/types?group=${encodeURIComponent(group)}`, {
          headers: { Authorization: getAuthHeader() }
        });
        if (!res.ok) return [group, []];
        const data = (await res.json()) as { values?: string[] };
        return [group, data.values ?? []];
      })
    );
    const next = { photographer: [], client: [], camera: [], city: [] } as Record<OptionGroup, string[]>;
    results.forEach(([group, values]) => (next[group] = values));
    setFieldOptions(next);
  }, []);

  const addFieldValue = useCallback(
    async (group: OptionGroup, value: string) => {
      const trimmed = value.trim();
      if (!trimmed) {
        showToast('Lütfen bir değer girin.', 'error');
        return false;
      }
      const res = await fetch('/api/admin/types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: getAuthHeader() },
        body: JSON.stringify({ group, value: trimmed })
      });
      if (!res.ok) {
        showToast('Değer eklenemedi.', 'error');
        return false;
      }
      showToast('Değer eklendi.', 'success');
      await loadFieldOptions();
      return true;
    },
    [loadFieldOptions]
  );

  useEffect(() => {
    const saved = sessionStorage.getItem('adminLogin');
    if (saved) {
      setLoginInput(saved);
      setIsAuthed(true);
    }
    setLoadingList(true);
    Promise.all([loadProjects(), loadPhotos(), loadFieldOptions()]).finally(() => setLoadingList(false));
  }, [loadProjects, loadPhotos, loadFieldOptions]);

  useEffect(() => {
    if (section === 'messages' && isAuthed) loadContacts();
  }, [section, isAuthed, loadContacts]);

  /* -------------------------- auth -------------------------- */

  const handleLogin = () => {
    const value = loginInput.trim();
    if (!value) {
      showToast('Lütfen kullanıcı adı ve şifre girin.', 'error');
      return;
    }
    saveLogin(value);
    setIsAuthed(true);
    setModal(null);
    showToast('Giriş yapıldı.', 'success');
  };

  const requireAuth = (action: () => void) => {
    if (!isAuthed) {
      setModal({ type: 'login' });
      return;
    }
    action();
  };

  /* -------------------------- project CRUD -------------------------- */

  const submitProjectForm = async (form: HTMLFormElement, mode: 'add' | 'edit', project?: ProjectRecord) => {
    const formData = new FormData(form);
    const title = String(formData.get('title') ?? '');
    formData.set('slug', slugify(title, { lower: true, strict: true, trim: true }));
    formData.set('homePage', (form.elements.namedItem('homePage') as HTMLInputElement)?.checked ? 'true' : 'false');

    setSubmitting(true);
    try {
      const res =
        mode === 'add'
          ? await fetch('/api/projects/upload', { method: 'POST', headers: { Authorization: getAuthHeader() }, body: formData })
          : await fetch(`/api/projects/${project!.id}`, { method: 'PUT', headers: { Authorization: getAuthHeader() }, body: formData });

      if (res.ok) {
        showToast(mode === 'add' ? 'Proje eklendi.' : 'Proje güncellendi.', 'success');
        setModal(null);
        await loadProjects();
      } else {
        showToast(mode === 'add' ? 'Proje eklenemedi.' : 'Proje güncellenemedi.', 'error');
      }
    } catch {
      showToast('Bir hata oluştu.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteProject = async (id: string | number) => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE', headers: { Authorization: getAuthHeader() } });
      if (res.ok) {
        showToast('Proje silindi.', 'success');
        setModal(null);
        if (selectedProjectId === id) setSelectedProjectId(null);
        await loadProjects();
        await loadPhotos();
      } else {
        showToast('Proje silinemedi.', 'error');
      }
    } catch {
      showToast('Bir hata oluştu.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleHomePage = (project: ProjectRecord) =>
    requireAuth(async () => {
      const next = !project.homePage;

      // Anında geri bildirim için önce arayüzü güncelle, istek başarısız olursa geri al.
      setProjects((prev) => prev.map((p) => (p.id === project.id ? { ...p, homePage: next } : p)));

      try {
        // Mevcut proje güncelleme servisini kullanıyoruz, sadece homePage alanını gönderiyoruz.
        const formData = new FormData();
        formData.set('homePage', next ? 'true' : 'false');

        const res = await fetch(`/api/projects/${project.id}`, {
          method: 'PUT',
          headers: { Authorization: getAuthHeader() },
          body: formData
        });
        if (!res.ok) throw new Error('failed');
        showToast(next ? 'Anasayfada gösteriliyor.' : 'Anasayfadan kaldırıldı.', 'success');
      } catch {
        setProjects((prev) => prev.map((p) => (p.id === project.id ? { ...p, homePage: !next } : p)));
        showToast('Güncellenemedi. (API henüz hazır olmayabilir)', 'error');
      }
    });

  /* -------------------------- photo CRUD -------------------------- */

  const submitPhotoForm = async (form: HTMLFormElement, mode: 'add' | 'edit', photo?: PhotoRecord) => {
    const formData = new FormData(form);
    setSubmitting(true);
    try {
      const res =
        mode === 'add'
          ? await fetch('/api/photo/upload', { method: 'POST', headers: { Authorization: getAuthHeader() }, body: formData })
          : await fetch(`/api/photo/${photo!.id}`, { method: 'PUT', headers: { Authorization: getAuthHeader() }, body: formData });

      if (res.ok) {
        showToast(mode === 'add' ? 'Fotoğraf eklendi.' : 'Fotoğraf güncellendi.', 'success');
        setModal(null);
        await loadPhotos();
      } else {
        showToast(mode === 'add' ? 'Fotoğraf eklenemedi.' : 'Fotoğraf güncellenemedi.', 'error');
      }
    } catch {
      showToast('Bir hata oluştu.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const deletePhoto = async (id: string | number) => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/photo/${id}`, { method: 'DELETE', headers: { Authorization: getAuthHeader() } });
      if (res.ok) {
        showToast('Fotoğraf silindi.', 'success');
        setModal(null);
        await loadPhotos();
      } else {
        showToast('Fotoğraf silinemedi.', 'error');
      }
    } catch {
      showToast('Bir hata oluştu.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteContact = async (id: string | number) => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/contact/${id}`, { method: 'DELETE', headers: { Authorization: getAuthHeader() } });
      if (res.ok) {
        showToast('Mesaj silindi.', 'success');
        setModal(null);
        await loadContacts();
      } else {
        showToast('Mesaj silinemedi.', 'error');
      }
    } catch {
      showToast('Bir hata oluştu.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  /* -------------------------- cache -------------------------- */

  const clearCache = async (slug?: string) => {
    const url = slug ? `/api/cache?slug=${encodeURIComponent(slug)}` : '/api/cache';
    const res = await fetch(url, { headers: { Authorization: getAuthHeader() } });
    showToast(
      res.ok
        ? slug
          ? 'Proje önbelleği temizlendi.'
          : 'Ana sayfa önbelleği temizlendi.'
        : 'Önbellek temizlenemedi. Giriş bilgilerini kontrol edin.',
      res.ok ? 'success' : 'error'
    );
  };

  /* -------------------------- derived -------------------------- */

  const photosByProject = useMemo(() => {
    const map = new Map<string | number, PhotoRecord[]>();
    photos.forEach((p) => {
      const list = map.get(p.projectsId) ?? [];
      list.push(p);
      map.set(p.projectsId, list);
    });
    return map;
  }, [photos]);

  const selectedProject = projects.find((p) => p.id === selectedProjectId) ?? null;
  const selectedProjectPhotos = selectedProjectId ? (photosByProject.get(selectedProjectId) ?? []) : [];

  const navItems: { id: SectionId; label: string; icon: string }[] = [
    { id: 'projects', label: 'Projeler', icon: 'image' },
    { id: 'messages', label: 'Mesajlar', icon: 'mail' },
    { id: 'settings', label: 'Ayarlar', icon: 'lock' }
  ];

  /* ------------------------------------------------------------------ */

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-stone-900 bg-stone-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-amber-500 text-stone-950">
              <Icon path={paths.image} className="h-4 w-4" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-wide">BsGallery</p>
              <p className="text-[11px] text-stone-500">Yönetim Paneli</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setModal({ type: 'login' })}
            className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium transition ${
              isAuthed
                ? 'border-emerald-800/60 bg-emerald-950/30 text-emerald-400 hover:border-emerald-700'
                : 'border-stone-800 text-stone-400 hover:border-stone-600 hover:text-stone-200'
            }`}
          >
            <Icon path={paths.user} className="h-3.5 w-3.5" />
            {isAuthed ? 'Giriş yapıldı' : 'Giriş yap'}
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6">
        {/* Side nav */}
        <nav className="sticky top-[73px] hidden h-fit w-48 shrink-0 flex-col gap-1 sm:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setSection(item.id);
                setSelectedProjectId(null);
              }}
              className={`flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                section === item.id ? 'bg-stone-900 text-amber-400' : 'text-stone-400 hover:bg-stone-900/60 hover:text-stone-200'
              }`}
            >
              <Icon path={paths[item.icon as keyof typeof paths]} className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Mobile tabs */}
        <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-stone-900 bg-stone-950/95 backdrop-blur sm:hidden">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setSection(item.id);
                setSelectedProjectId(null);
              }}
              className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${
                section === item.id ? 'text-amber-400' : 'text-stone-500'
              }`}
            >
              <Icon path={paths[item.icon as keyof typeof paths]} className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Main content */}
        <main className="min-w-0 flex-1 pb-20 sm:pb-0">
          {section === 'projects' && !selectedProject && (
            <ProjectsList
              projects={projects}
              photosByProject={photosByProject}
              loading={loadingList}
              onAdd={() => requireAuth(() => setModal({ type: 'project-form', mode: 'add' }))}
              onOpen={(id) => setSelectedProjectId(id)}
              onEdit={(project) => requireAuth(() => setModal({ type: 'project-form', mode: 'edit', project }))}
              onDelete={(project) =>
                requireAuth(() => setModal({ type: 'confirm-delete', target: 'project', id: project.id, label: project.title }))
              }
              onToggleHomePage={toggleHomePage}
            />
          )}

          {section === 'projects' && selectedProject && (
            <ProjectDetail
              project={selectedProject}
              photos={selectedProjectPhotos}
              onBack={() => setSelectedProjectId(null)}
              onEditProject={() => requireAuth(() => setModal({ type: 'project-form', mode: 'edit', project: selectedProject }))}
              onDeleteProject={() =>
                requireAuth(() =>
                  setModal({ type: 'confirm-delete', target: 'project', id: selectedProject.id, label: selectedProject.title })
                )
              }
              onAddPhoto={() => requireAuth(() => setModal({ type: 'photo-form', mode: 'add', projectId: selectedProject.id }))}
              onEditPhoto={(photo) => requireAuth(() => setModal({ type: 'photo-form', mode: 'edit', photo }))}
              onDeletePhoto={(photo) =>
                requireAuth(() =>
                  setModal({ type: 'confirm-delete', target: 'photo', id: photo.id, label: photo.title || `Fotoğraf #${photo.id}` })
                )
              }
              onToggleHomePage={toggleHomePage}
            />
          )}

          {section === 'messages' && (
            <MessagesPanel
              contacts={contacts}
              isAuthed={isAuthed}
              onLogin={() => setModal({ type: 'login' })}
              onDelete={(contact) =>
                requireAuth(() =>
                  setModal({
                    type: 'confirm-delete',
                    target: 'message',
                    id: contact.id,
                    label: contact.subject || contact.name || `Mesaj #${contact.id}`
                  })
                )
              }
            />
          )}

          {section === 'settings' && (
            <SettingsPanel
              isAuthed={isAuthed}
              projects={projects}
              cacheSlug={cacheSlug}
              setCacheSlug={setCacheSlug}
              onClearCache={clearCache}
              fieldOptions={fieldOptions}
              onAddFieldValue={addFieldValue}
              onLogin={() => setModal({ type: 'login' })}
              loginInput={loginInput}
              setLoginInput={setLoginInput}
              onSaveLogin={handleLogin}
              onLogout={() => {
                sessionStorage.removeItem('adminLogin');
                setIsAuthed(false);
                setLoginInput('');
                showToast('Çıkış yapıldı.', 'info');
              }}
            />
          )}
        </main>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-md border px-4 py-2.5 text-sm shadow-xl sm:bottom-6 ${
            toast.tone === 'success'
              ? 'border-emerald-800/60 bg-emerald-950/90 text-emerald-300'
              : toast.tone === 'error'
                ? 'border-red-900/60 bg-red-950/90 text-red-300'
                : 'border-stone-700 bg-stone-900 text-stone-200'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Modals */}
      {modal?.type === 'login' && (
        <Modal title="Yönetici Girişi" onClose={() => setModal(null)}>
          <div className="grid gap-4">
            <Field label="Kullanıcı adı / şifre" required>
              <input
                autoFocus
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="kullanici:sifre"
                className={inputClass}
              />
            </Field>
            <PrimaryButton onClick={handleLogin} full icon="check">
              Giriş yap
            </PrimaryButton>
          </div>
        </Modal>
      )}

      {modal?.type === 'project-form' && (
        <Modal title={modal.mode === 'add' ? 'Yeni Proje' : 'Projeyi Düzenle'} onClose={() => setModal(null)} wide>
          <ProjectForm
            mode={modal.mode}
            project={modal.mode === 'edit' ? modal.project : undefined}
            fieldOptions={fieldOptions}
            onAddFieldValue={addFieldValue}
            submitting={submitting}
            onSubmit={(form) => submitProjectForm(form, modal.mode, modal.mode === 'edit' ? modal.project : undefined)}
          />
        </Modal>
      )}

      {modal?.type === 'photo-form' && (
        <Modal title={modal.mode === 'add' ? 'Fotoğraf Ekle' : 'Fotoğrafı Düzenle'} onClose={() => setModal(null)} wide>
          <PhotoForm
            mode={modal.mode}
            photo={modal.mode === 'edit' ? modal.photo : undefined}
            defaultProjectId={modal.mode === 'add' ? modal.projectId : modal.photo.projectsId}
            projects={projects}
            fieldOptions={fieldOptions}
            onAddFieldValue={addFieldValue}
            submitting={submitting}
            onSubmit={(form) => submitPhotoForm(form, modal.mode, modal.mode === 'edit' ? modal.photo : undefined)}
          />
        </Modal>
      )}

      {modal?.type === 'confirm-delete' && (
        <Modal title="Silme Onayı" onClose={() => setModal(null)}>
          <div className="grid gap-4">
            <p className="text-sm text-stone-300">
              <span className="font-medium text-stone-100">{modal.label}</span>{' '}
              {modal.target === 'project' ? 'projesini' : modal.target === 'photo' ? 'fotoğrafını' : 'mesajını'} kalıcı olarak silmek
              istediğinize emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex justify-end gap-2">
              <GhostButton onClick={() => setModal(null)}>Vazgeç</GhostButton>
              <button
                type="button"
                disabled={submitting}
                onClick={() =>
                  modal.target === 'project'
                    ? deleteProject(modal.id)
                    : modal.target === 'photo'
                      ? deletePhoto(modal.id)
                      : deleteContact(modal.id)
                }
                className="inline-flex items-center gap-2 rounded-md bg-red-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
              >
                <Icon path={paths.trash} className="h-4 w-4" />
                {submitting ? 'Siliniyor...' : 'Sil'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Projects — list view (contact-sheet grid)                          */
/* ------------------------------------------------------------------ */

function ProjectsList({
  projects,
  photosByProject,
  loading,
  onAdd,
  onOpen,
  onEdit,
  onDelete,
  onToggleHomePage
}: {
  projects: ProjectRecord[];
  photosByProject: Map<string | number, PhotoRecord[]>;
  loading: boolean;
  onAdd: () => void;
  onOpen: (id: string | number) => void;
  onEdit: (project: ProjectRecord) => void;
  onDelete: (project: ProjectRecord) => void;
  onToggleHomePage: (project: ProjectRecord) => void;
}) {
  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-stone-100">Projeler</h1>
          <p className="text-sm text-stone-500">{projects.length} proje</p>
        </div>
        <PrimaryButton onClick={onAdd} icon="plus">
          Yeni Proje
        </PrimaryButton>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] animate-pulse rounded-lg border border-stone-900 bg-stone-900/40" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState icon="image" title="Henüz proje yok" hint="Galeriye ilk projeyi ekleyerek başlayın." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {projects.map((project) => {
            const count = photosByProject.get(project.id)?.length ?? 0;
            const img = getImageUrl(project);
            return (
              <div
                key={project.id}
                className="group relative flex flex-col overflow-hidden rounded-lg border border-stone-900 bg-stone-900/40 transition hover:border-stone-700"
              >
                <button
                  type="button"
                  onClick={() => onOpen(project.id)}
                  className="relative aspect-[4/5] w-full overflow-hidden bg-stone-900"
                >
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img} alt={project.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-stone-700">
                      <Icon path={paths.image} className="h-8 w-8" />
                    </div>
                  )}
                  {project.homePage && (
                    <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-stone-950">
                      <Icon path={paths.home} className="h-3 w-3" />
                      Anasayfa
                    </span>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-3 pt-8 text-left">
                    <p className="truncate text-sm font-medium text-stone-100">{project.title}</p>
                    <p className="mt-0.5 text-xs text-stone-400">{count} fotoğraf</p>
                  </div>
                </button>

                <div className="flex items-center justify-between gap-2 border-t border-stone-900 px-3 py-2">
                  <Badge tone={Number((project as unknown as { status: number }).status) === 0 ? 'active' : 'inactive'}>
                    {Number((project as unknown as { status: number }).status) === 0 ? 'Aktif' : 'Pasif'}
                  </Badge>
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1.5" title="Anasayfada göster">
                      <Icon path={paths.home} className="h-3.5 w-3.5 text-stone-500" />
                      <Switch checked={Boolean(project.homePage)} onChange={() => onToggleHomePage(project)} label="Anasayfada göster" />
                    </div>
                    <span className="h-4 w-px bg-stone-800" />
                    <div className="flex gap-1.5">
                      <IconButton icon="edit" label="Düzenle" onClick={() => onEdit(project)} />
                      <IconButton icon="trash" label="Sil" tone="danger" onClick={() => onDelete(project)} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Project detail — photo contact sheet                               */
/* ------------------------------------------------------------------ */

function ProjectDetail({
  project,
  photos,
  onBack,
  onEditProject,
  onDeleteProject,
  onAddPhoto,
  onEditPhoto,
  onDeletePhoto,
  onToggleHomePage
}: {
  project: ProjectRecord;
  photos: PhotoRecord[];
  onBack: () => void;
  onEditProject: () => void;
  onDeleteProject: () => void;
  onAddPhoto: () => void;
  onEditPhoto: (photo: PhotoRecord) => void;
  onDeletePhoto: (photo: PhotoRecord) => void;
  onToggleHomePage: (project: ProjectRecord) => void;
}) {
  return (
    <div>
      <button type="button" onClick={onBack} className="mb-4 inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-200">
        <Icon path={paths.back} className="h-4 w-4" />
        Projelere dön
      </button>

      <div className="mb-6 flex flex-col gap-3 border-b border-stone-900 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-stone-100">{project.title}</h1>
          <p className="mt-1 text-sm text-stone-500">
            {photos.length} fotoğraf · <span className="font-mono text-xs">{project.slug}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-md border border-stone-800 px-2.5 py-2" title="Anasayfada göster">
            <Icon path={paths.home} className="h-3.5 w-3.5 text-stone-400" />
            <span className="text-xs text-stone-400">Anasayfa</span>
            <Switch checked={Boolean(project.homePage)} onChange={() => onToggleHomePage(project)} label="Anasayfada göster" />
          </div>
          <GhostButton icon="edit" onClick={onEditProject}>
            Projeyi Düzenle
          </GhostButton>
          <GhostButton icon="trash" onClick={onDeleteProject}>
            Sil
          </GhostButton>
          <PrimaryButton icon="plus" onClick={onAddPhoto}>
            Fotoğraf Ekle
          </PrimaryButton>
        </div>
      </div>

      {photos.length === 0 ? (
        <EmptyState icon="image" title="Bu projede fotoğraf yok" hint="Kontakt sayfasını doldurmak için ilk fotoğrafı ekleyin." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((photo, index) => {
            const img = getImageUrl(photo);
            return (
              <div
                key={photo.id}
                className="group relative overflow-hidden rounded-lg border border-stone-900 bg-stone-900/40 transition hover:border-stone-700"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-stone-900">
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img} alt={photo.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-stone-700">
                      <Icon path={paths.image} className="h-7 w-7" />
                    </div>
                  )}
                  <span className="absolute left-2 top-2 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[10px] text-stone-300">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="absolute inset-x-0 top-0 flex justify-end gap-1.5 p-2 opacity-0 transition group-hover:opacity-100">
                    <IconButton icon="edit" label="Düzenle" onClick={() => onEditPhoto(photo)} />
                    <IconButton icon="trash" label="Sil" tone="danger" onClick={() => onDeletePhoto(photo)} />
                  </div>
                </div>
                <div className="px-2.5 py-2">
                  <p className="truncate text-xs font-medium text-stone-200">{photo.title || 'Başlıksız'}</p>
                  <p className="truncate font-mono text-[11px] text-stone-500">{photo.city || photo.location || '—'}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Project form (add / edit)                                          */
/* ------------------------------------------------------------------ */

function ProjectForm({
  mode,
  project,
  fieldOptions,
  onAddFieldValue,
  submitting,
  onSubmit
}: {
  mode: 'add' | 'edit';
  project?: ProjectRecord;
  fieldOptions: Record<OptionGroup, string[]>;
  onAddFieldValue: (group: OptionGroup, value: string) => Promise<boolean>;
  submitting: boolean;
  onSubmit: (form: HTMLFormElement) => void;
}) {
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(e.currentTarget);
      }}
      className="grid gap-4"
    >
      <Field label="Proje Fotoğrafı" required={mode === 'add'}>
        <input type="file" name="file" required={mode === 'add'} accept="image/*" className="w-full text-sm text-stone-400" />
        {mode === 'edit' && <p className="text-xs text-stone-600">Boş bırakılırsa mevcut görsel korunur.</p>}
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <ComboField
          label="Müşteri"
          name="client"
          group="client"
          options={fieldOptions.client}
          defaultValue={project?.client}
          onAdd={onAddFieldValue}
        />
        <ComboField
          label="Kamera"
          name="camera"
          group="camera"
          options={fieldOptions.camera}
          defaultValue={project?.camera}
          onAdd={onAddFieldValue}
        />
      </div>

      <Field label="Başlık" required>
        <input name="title" required defaultValue={project?.title} className={inputClass} />
      </Field>

      <Field label="Açıklama">
        <textarea name="description" rows={4} defaultValue={project?.description} className={inputClass} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <ComboField
          label="Şehir"
          name="city"
          group="city"
          options={fieldOptions.city}
          defaultValue={project?.city}
          onAdd={onAddFieldValue}
        />
        <ComboField
          label="Fotoğrafçı"
          name="photographer"
          group="photographer"
          options={fieldOptions.photographer}
          defaultValue={project?.photographer}
          onAdd={onAddFieldValue}
        />
      </div>

      <Field label="Kategori" required>
        <select name="category" required defaultValue={project?.category ?? ''} className={inputClass}>
          <option value="">Kategori seçin</option>
          {CATEGORY_OPTIONS.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Durum" required>
        <select name="status" required defaultValue={String(project?.status ?? '0')} className={inputClass}>
          <option value="0">Aktif</option>
          <option value="1">Pasif</option>
        </select>
      </Field>

      <label className="flex items-center gap-2 text-sm text-stone-300">
        <input type="checkbox" name="homePage" defaultChecked={project?.homePage} className="rounded border-stone-700 bg-stone-900" />
        Anasayfada göster
      </label>

      <PrimaryButton type="submit" disabled={submitting} full icon={mode === 'add' ? 'plus' : 'check'}>
        {submitting ? 'Kaydediliyor...' : mode === 'add' ? 'Projeyi Ekle' : 'Değişiklikleri Kaydet'}
      </PrimaryButton>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/*  Photo form (add / edit)                                            */
/* ------------------------------------------------------------------ */

function PhotoForm({
  mode,
  photo,
  defaultProjectId,
  projects,
  fieldOptions,
  onAddFieldValue,
  submitting,
  onSubmit
}: {
  mode: 'add' | 'edit';
  photo?: PhotoRecord;
  defaultProjectId: string | number;
  projects: ProjectRecord[];
  fieldOptions: Record<OptionGroup, string[]>;
  onAddFieldValue: (group: OptionGroup, value: string) => Promise<boolean>;
  submitting: boolean;
  onSubmit: (form: HTMLFormElement) => void;
}) {
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(e.currentTarget);
      }}
      className="grid gap-4"
    >
      <Field label="Fotoğraf" required={mode === 'add'}>
        <input type="file" name="file" required={mode === 'add'} accept="image/*" className="w-full text-sm text-stone-400" />
        {mode === 'edit' && <p className="text-xs text-stone-600">Boş bırakılırsa mevcut görsel korunur.</p>}
      </Field>

      <Field label="Proje" required>
        <select name="projectsId" required defaultValue={String(defaultProjectId)} className={inputClass}>
          <option value="">Proje seçin</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.title}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Başlık" required>
        <input name="title" required defaultValue={photo?.title} className={inputClass} />
      </Field>

      <Field label="Alt Başlık">
        <input name="subtitle" defaultValue={photo?.subtitle} className={inputClass} />
      </Field>

      <Field label="Açıklama">
        <textarea name="description" rows={4} defaultValue={photo?.description} className={inputClass} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <ComboField
          label="Konum"
          name="location"
          group="city"
          options={fieldOptions.city}
          defaultValue={photo?.location}
          onAdd={onAddFieldValue}
        />
        <ComboField label="Şehir" name="city" group="city" options={fieldOptions.city} defaultValue={photo?.city} onAdd={onAddFieldValue} />
      </div>

      <Field label="Kategori" required>
        <select name="category" required defaultValue={photo?.category ?? ''} className={inputClass}>
          <option value="">Kategori seçin</option>
          {CATEGORY_OPTIONS.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </Field>

      <ComboField
        label="Fotoğrafçı"
        name="photographer"
        group="photographer"
        options={fieldOptions.photographer}
        defaultValue={photo?.photographer}
        onAdd={onAddFieldValue}
      />

      <PrimaryButton type="submit" disabled={submitting} full icon={mode === 'add' ? 'plus' : 'check'}>
        {submitting ? 'Kaydediliyor...' : mode === 'add' ? 'Fotoğrafı Ekle' : 'Değişiklikleri Kaydet'}
      </PrimaryButton>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/*  Messages                                                            */
/* ------------------------------------------------------------------ */

function MessagesPanel({
  contacts,
  isAuthed,
  onLogin,
  onDelete
}: {
  contacts: ContactMessage[];
  isAuthed: boolean;
  onLogin: () => void;
  onDelete: (contact: ContactMessage) => void;
}) {
  const [openId, setOpenId] = useState<string | number | null>(null);

  if (!isAuthed) {
    return (
      <div>
        <h1 className="mb-5 text-lg font-semibold text-stone-100">Mesajlar</h1>
        <EmptyState icon="lock" title="Giriş gerekli" hint="Mesajları görüntülemek için yönetici olarak giriş yapın." />
        <div className="mt-4 flex justify-center">
          <GhostButton icon="user" onClick={onLogin}>
            Giriş yap
          </GhostButton>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-stone-100">Mesajlar</h1>
          <p className="text-sm text-stone-500">{contacts.length} mesaj</p>
        </div>
      </div>

      {contacts.length === 0 ? (
        <EmptyState icon="mail" title="Henüz mesaj yok" hint="İletişim formu üzerinden gelen mesajlar burada listelenecek." />
      ) : (
        <div className="grid gap-2.5">
          {contacts.map((contact) => {
            const isOpen = openId === contact.id;
            return (
              <div key={contact.id} className="overflow-hidden rounded-lg border border-stone-900 bg-stone-900/40">
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : contact.id)}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-800 text-xs font-semibold uppercase text-amber-400">
                    {contact.name?.slice(0, 2) || '??'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium text-stone-100">{contact.name}</p>
                      <span className="shrink-0 font-mono text-[11px] text-stone-600">
                        {new Date(contact.created).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                    <p className="truncate text-xs text-stone-500">{contact.subject}</p>
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-stone-900 px-4 py-3.5">
                    <p className="whitespace-pre-wrap text-sm text-stone-300">{contact.message}</p>
                    <div className="mt-3 flex items-center justify-between gap-3 text-xs text-stone-500">
                      <div className="flex items-center gap-3">
                        <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-1.5 text-amber-400 hover:underline">
                          <Icon path={paths.mail} className="h-3.5 w-3.5" />
                          {contact.email}
                        </a>
                        <span className="font-mono">#{contact.id}</span>
                      </div>
                      <IconButton icon="trash" label="Mesajı sil" tone="danger" onClick={() => onDelete(contact)} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Settings                                                            */
/* ------------------------------------------------------------------ */

function SettingsPanel({
  isAuthed,
  projects,
  cacheSlug,
  setCacheSlug,
  onClearCache,
  fieldOptions,
  onAddFieldValue,
  onLogin,
  loginInput,
  setLoginInput,
  onSaveLogin,
  onLogout
}: {
  isAuthed: boolean;
  projects: ProjectRecord[];
  cacheSlug: string;
  setCacheSlug: (v: string) => void;
  onClearCache: (slug?: string) => void;
  fieldOptions: Record<OptionGroup, string[]>;
  onAddFieldValue: (group: OptionGroup, value: string) => Promise<boolean>;
  onLogin: () => void;
  loginInput: string;
  setLoginInput: (v: string) => void;
  onSaveLogin: () => void;
  onLogout: () => void;
}) {
  const groupLabels: Record<OptionGroup, string> = {
    photographer: 'Fotoğrafçılar',
    client: 'Müşteriler',
    camera: 'Kameralar',
    city: 'Şehirler'
  };

  return (
    <div className="grid gap-6">
      <h1 className="text-lg font-semibold text-stone-100">Ayarlar</h1>

      {/* Account */}
      <section className="rounded-lg border border-stone-900 bg-stone-900/40 p-5">
        <h2 className="mb-1 text-sm font-semibold text-stone-200">Yönetici Hesabı</h2>
        <p className="mb-4 text-xs text-stone-500">Giriş bilgileri yalnızca bu tarayıcı oturumunda saklanır.</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={loginInput}
            onChange={(e) => setLoginInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSaveLogin()}
            placeholder="kullanici:sifre"
            className={inputClass}
          />
          {isAuthed ? (
            <GhostButton onClick={onLogout}>Çıkış yap</GhostButton>
          ) : (
            <PrimaryButton onClick={onSaveLogin} icon="check">
              Kaydet
            </PrimaryButton>
          )}
        </div>
      </section>

      {/* Cache */}
      <section className="rounded-lg border border-stone-900 bg-stone-900/40 p-5">
        <h2 className="mb-1 text-sm font-semibold text-stone-200">Önbellek</h2>
        <p className="mb-4 text-xs text-stone-500">Değişikliklerin sitede görünmesi için önbelleği temizleyin.</p>
        <div className="grid gap-3">
          <GhostButton icon="broom" onClick={() => (isAuthed ? onClearCache() : onLogin())}>
            Ana Sayfa Önbelleğini Temizle
          </GhostButton>
          <div className="flex flex-col gap-2 sm:flex-row">
            <select value={cacheSlug} onChange={(e) => setCacheSlug(e.target.value)} className={inputClass}>
              <option value="">Proje seçin</option>
              {projects.map((project) => (
                <option key={project.id} value={project.slug}>
                  {project.title}
                </option>
              ))}
            </select>
            <GhostButton
              icon="broom"
              onClick={() => {
                if (!cacheSlug) return;
                isAuthed ? onClearCache(cacheSlug) : onLogin();
              }}
            >
              Proje Önbelleğini Temizle
            </GhostButton>
          </div>
        </div>
      </section>

      {/* Taxonomy management */}
      <section className="rounded-lg border border-stone-900 bg-stone-900/40 p-5">
        <h2 className="mb-1 text-sm font-semibold text-stone-200">Alan Listeleri</h2>
        <p className="mb-4 text-xs text-stone-500">
          Fotoğrafçı, müşteri, kamera ve şehir alanlarında öneri olarak görünen değerler. Silme desteği eklenene kadar yalnızca yeni değer
          eklenebilir.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          {(Object.keys(groupLabels) as OptionGroup[]).map((group) => (
            <TaxonomyGroup key={group} group={group} label={groupLabels[group]} values={fieldOptions[group]} onAdd={onAddFieldValue} />
          ))}
        </div>
      </section>
    </div>
  );
}

function TaxonomyGroup({
  group,
  label,
  values,
  onAdd
}: {
  group: OptionGroup;
  label: string;
  values: string[];
  onAdd: (group: OptionGroup, value: string) => Promise<boolean>;
}) {
  const [value, setValue] = useState('');

  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.08em] text-stone-500">{label}</p>
      <div className="mb-2 flex flex-wrap gap-1.5">
        {values.length === 0 && <span className="text-xs text-stone-600">Henüz değer yok</span>}
        {values.map((v) => (
          <span key={v} className="rounded-full border border-stone-800 bg-stone-900 px-2.5 py-1 text-xs text-stone-300">
            {v}
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Yeni değer"
          className="w-full rounded-md border border-stone-800 bg-stone-950 px-2.5 py-1.5 text-xs text-stone-100 outline-none focus:border-amber-600"
        />
        <button
          type="button"
          onClick={async () => {
            const added = await onAdd(group, value);
            if (added) setValue('');
          }}
          className="shrink-0 rounded-md border border-stone-800 px-2.5 text-xs font-medium text-stone-300 hover:border-stone-600 hover:bg-stone-900"
        >
          Ekle
        </button>
      </div>
    </div>
  );
}
