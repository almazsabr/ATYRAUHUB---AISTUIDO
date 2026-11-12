export type ProjectStatus = 'completed' | 'ongoing' | 'upcoming';

export interface ProjectMetric {
  label: string;
  value: string;
  improvement: string;
}

export interface Project {
  id: string;
  title: string;
  client: string;
  industry: string;
  status: ProjectStatus;
  period: string;
  summary: string;
  description: string;
  metrics: ProjectMetric[];
  techStack: string[];
  image: string;
  architectureHighlight: string;
  roiDuration: string;
  deliverables: string[];
}

export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  date: string;
  category: string;
  readTime: string;
  summary: string;
  problem: string;
  solution: string;
  results: {
    metric: string;
    before: string;
    after: string;
    change: string;
  }[];
  techStack: string[];
  architectureSteps: string[];
  takeaways: string[];
  image: string;
}

export interface ConsultationBooking {
  id: string;
  name: string;
  company: string;
  industry: string;
  email: string;
  phone: string;
  telegram: string;
  topic: string;
  date: string;
  timeSlot: string;
  format: 'Google Meet' | 'Telegram Call' | 'Zoom' | 'Личная встреча (Москва/выезд)';
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed';
  createdAt: string;
}

export interface ClientDocument {
  id: string;
  title: string;
  type: 'NDA' | 'ТЗ' | 'Audit' | 'Act' | 'Report';
  fileName: string;
  date: string;
  size: string;
  status: 'signed' | 'ready' | 'draft';
  downloadUrl?: string;
}

export interface ClientInteraction {
  id: string;
  date: string;
  title: string;
  type: 'Аудит объекта' | 'Техническая сессия' | 'Демо пилота' | 'Сдача этапа' | 'Координация';
  participants: string;
  summary: string;
  actionItems: string[];
}

export interface BackupSnapshot {
  id: string;
  timestamp: string;
  fileName: string;
  size: string;
  tablesCount: number;
  recordsCount: number;
  sha256: string;
  type: 'manual' | 'scheduled';
  storageTarget: string;
  status: 'verified' | 'syncing' | 'archived';
}

export interface TelegramNotificationSettings {
  botHandle: string;
  chatId: string;
  connected: boolean;
  notifyOnBooking: boolean;
  notifyOnContact: boolean;
  notifyOnBackup: boolean;
  notifyOnClientDoc: boolean;
  notifyOnAnomaly: boolean;
}

export interface TelegramMessageLog {
  id: string;
  time: string;
  type: 'lead' | 'booking' | 'backup' | 'system';
  title: string;
  body: string;
}
