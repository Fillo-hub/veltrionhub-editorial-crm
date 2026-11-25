export type PostStatus = 'published' | 'draft' | 'review' | 'archived';

export interface PostComment {
  id: string;
  text: string;
  username: string;
  date?: string;
}

export interface Post {
  id: string;
  title: string;
  body: string;
  excerpt?: string;
  author: string;
  date: string;
  status: PostStatus;
  category: string;
  views: number;
  featured?: boolean;
  tags?: string[];
  comments: PostComment[];
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface EditorialTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assignee: string;
  category?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  bio: string;
  avatar: string;
  company: string;
}
