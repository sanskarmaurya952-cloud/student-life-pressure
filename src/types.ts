export type CategoryType =
  | 'Academic Pressure'
  | 'Career Anxiety'
  | 'Family Expectations'
  | 'Financial Stress'
  | 'Social Comparison'
  | 'Sleep & Burnout'
  | 'Relationships'
  | 'Balance';

export type ViewMode = 'explore' | 'moments' | 'connections' | 'archive' | 'story';

export interface ArtifactData {
  id: string;
  category: CategoryType;
  title: string;
  subtitle: string;
  timestamp: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: [number, number, number];
  accentColor: string;
  meta: Record<string, string>;
  connectedTo: string[]; // IDs of related artifacts
  narrativeNote?: string;
  detailedItems?: Array<{ label: string; detail: string; value?: string }>;
}

export interface MomentData {
  id: string;
  code: string; // e.g., "MOMENT 024"
  title: string;
  date: string;
  tagline: string;
  narrative: string;
  traceIds: string[]; // Order: e.g. Music -> Place -> Purchase -> Event
  themeColor: string;
  location?: string;
}

export interface CategoryInfo {
  id: string;
  slug: string;
  name: CategoryType;
  tagline: string;
  atmosphere: string;
  subtitle: string;
  description: string;
  accentColor: string;
  secondaryColor?: string;
  iconName: string;
  totalTraces: number;
  dateRange: string;
  stats: Array<{ label: string; value: string }>;
  representativeItems: Array<{
    title: string;
    detail: string;
    timestamp: string;
    badge?: string;
  }>;
  primaryArtifactId: string;
}
