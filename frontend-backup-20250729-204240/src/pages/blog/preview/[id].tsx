// filepath: /src/pages/blog/preview/[id].tsx
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

interface Author {
  username?: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
}

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: Author;
  category: string;
  status: string;
  publishedAt: string | null;
  updatedAt: string;
  featuredImage?: string;
  tags?: string[];
}

const BlogPreviewPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/blogs/preview/${id}`);
        const data = await res.json();
        if (data.success) {
          setPost(data.data);
        } else {
          setError(data.error || 'Blog yazısı bulunamadı');
        }
      } catch (err: any) {
        setError('Sunucu hatası');
      }
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!post) return null;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      {post.featuredImage && (
        <img src={post.featuredImage} alt={post.title} className="w-full h-64 object-cover rounded-md mb-6" />
      )}
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <div className="flex items-center mb-4 text-gray-500 text-sm">
        <span>{post.category}</span>
        <span className="mx-2">•</span>
        <span>{post.author?.firstName || ''} {post.author?.lastName || post.author?.username || 'Anonim'}</span>
        <span className="mx-2">•</span>
        <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('tr-TR') : 'Taslak'}</span>
      </div>
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
      {post.tags && post.tags.length > 0 && (
        <div className="mt-6">
          <span className="font-semibold text-gray-700">Etiketler: </span>
          {post.tags.map((tag) => (
            <span key={tag} className="inline-block bg-gray-200 rounded px-2 py-1 text-xs text-gray-700 mr-2">#{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogPreviewPage;
