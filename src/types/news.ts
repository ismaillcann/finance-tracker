export interface NewsItem {
    id: string;
    title: string;
    summary: string;
    source: string;
    imageUrl?: string;
    url: string;
    publishedAt: string; // ISO string
    category: 'crypto' | 'stock' | 'general';
}
