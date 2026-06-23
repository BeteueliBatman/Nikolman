export type LocalizedText = {
  en: string;
  ka: string;
};

export type PublishStatus = "draft" | "published";

export type ProjectCategoryKey =
  | "industrial"
  | "residential"
  | "commercial"
  | "institutional";

export type NewsroomCategoryKey =
  | "projectNews"
  | "companyNews"
  | "innovation"
  | "pressRelease";

export type NewsroomCompanyKey =
  | "nikolmanGroup"
  | "nikolmanConcrete"
  | "nikolmanProjects";

export type ProjectRow = {
  id: string;
  slug: string;
  image_url: string;
  category_key: ProjectCategoryKey;
  year: string;
  metric: string;
  featured: boolean;
  sort_order: number;
  status: PublishStatus;
  title: LocalizedText;
  description: LocalizedText;
  project_status: LocalizedText;
  location: LocalizedText;
  scope: LocalizedText;
  created_at: string;
  updated_at: string;
};

export type ArticleRow = {
  id: string;
  slug: string;
  image_url: string;
  category_key: NewsroomCategoryKey;
  company_key: NewsroomCompanyKey;
  published_at: string;
  status: PublishStatus;
  title: LocalizedText;
  summary: LocalizedText;
  body: LocalizedText;
  created_at: string;
  updated_at: string;
};

export type ContactSubmissionRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  locale: string;
  created_at: string;
};

export type NewsletterSubscriberRow = {
  id: string;
  email: string;
  locale: string;
  created_at: string;
};

export type MediaAssetType = "image" | "document";

export type MediaAssetRow = {
  id: string;
  media_type: MediaAssetType;
  file_url: string;
  file_meta: string;
  sort_order: number;
  status: PublishStatus;
  title: LocalizedText;
  created_at: string;
  updated_at: string;
};
