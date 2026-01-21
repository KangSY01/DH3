
export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  category: 'opening' | 'war' | 'growth' | 'future';
  imageUrl: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface BoardPost {
  id: string;
  author: string;
  content: string;
  date: string;
  likes: number;
}
