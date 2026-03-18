export interface Blog {
  id: string;
  userId: string;
  name: string;
  niche: string;
  bloggerEmail: string; // The secret email to post
  blogUrl: string;
  blogId: string;
  createdAt: any;
  automationEnabled: boolean;
  postsPerDay: number;
}

export interface Keyword {
  id: string;
  keyword: string;
  blogId: string;
  userId: string;
  status: 'unused' | 'published' | 'queued';
  niche: string;
  search_volume: number;
  difficulty: number;
  competition: string;
  createdAt: any;
  topic?: string; // For clustering
}

export interface Article {
  id: string;
  blogId: string;
  userId: string;
  keywordId: string;
  title: string;
  content: string;
  metaDescription: string;
  imageUrl: string;
  status: 'draft' | 'published';
  publishedAt?: any;
  createdAt: any;
}
