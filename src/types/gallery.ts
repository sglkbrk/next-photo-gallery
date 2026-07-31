export enum Category {
  portrait = 0,
  landscape = 1,
  food = 2,
  nature = 3,
  night = 4,
  travel = 5,
  street = 6,
  CityandArchitecture = 7,
  other = 8
}

export enum Format {
  horizontal = 0,
  vertical = 1
}

export enum Status {
  Active = 0,
  Inactive = 1
}

export interface Project {
  id: number;
  title: string;
  description: string;
  city: string;
  client: string;
  photographer: string;
  camera: string;
  category: Category;
  mainImageUrl: string | null;
  slug: string;
  status: Status;
  homePage: boolean;
  createdAt: string;
  photos?: Photo[];
}

export interface Photo {
  id: number;
  projectsId: number;
  photoUrl: string | null;
  title: string;
  subtitle: string;
  description: string;
  location: string;
  city: string;
  photographer: string;
  category: Category;
  size: number;
  format: Format;
  width: number;
  height: number;
  camera?: string | null;
  lens?: string | null;
  focalLength?: string | null;
  aperture?: string | null;
  iso?: string | null;
  shutterSpeed?: string | null;
  date?: string | null;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created: string;
}

export const CATEGORY_OPTIONS = [
  { value: 0, label: 'Portrait' },
  { value: 1, label: 'Landscape' },
  { value: 2, label: 'Food' },
  { value: 3, label: 'Nature' },
  { value: 4, label: 'Night' },
  { value: 5, label: 'Travel' },
  { value: 6, label: 'Street' },
  { value: 7, label: 'City and Architecture' },
  { value: 8, label: 'Other' }
] as const;
