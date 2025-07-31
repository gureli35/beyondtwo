import { useState, useEffect } from 'react';

// Function to decode HTML entities
function decodeHTMLEntities(text: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text.replace(/<[^>]*>/g, ''); // Also remove HTML tags
  return textarea.value;
}

// Function to extract image URLs from HTML content
function extractImagesFromContent(content: string): string[] {
  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  const images: string[] = [];
  let match;
  
  while ((match = imgRegex.exec(content)) !== null) {
    if (match[1]) {
      images.push(match[1]);
    }
  }
  
  return images;
}

// WordPress post interface
export interface WordPressPost {
  ID: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  modified: string;
  author: {
    name: string;
  };
  featured_image: string;
  categories: {
    [key: string]: {
      ID: number;
      name: string;
      slug: string;
      description: string;
      post_count: number;
      parent: number;
      meta: any;
    };
  };
  tags: {
    [key: string]: {
      ID: number;
      name: string;
      slug: string;
      description: string;
      post_count: number;
      meta: any;
    };
  };
  slug: string;
  attachments?: {
    [key: string]: {
      ID: number;
      URL: string;
      guid: string;
      mime_type: string;
      width: number;
      height: number;
    };
  };
}

// Transformed post to match our app's structure
export interface TransformedPost {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
  };
  publishedAt: string;
  image: string;
  featuredImage: string;
  images: string[]; // Array of all images in the post
  category: string;
  tags: string[];
  slug: string;
}

export function useWordPressPosts(categoryFilter?: string) {
  const [posts, setPosts] = useState<TransformedPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch('https://public-api.wordpress.com/rest/v1.1/sites/beyond2capi.wordpress.com/posts');
        
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && data.posts) {
          // Transform WordPress posts to match our app's structure
          const transformedPosts: TransformedPost[] = data.posts.map((post: any) => {
            // Extract category name safely
            let categoryName = 'Uncategorized';
            if (post.categories && typeof post.categories === 'object') {
              // Get the first category name from the categories object
              const categoryValues = Object.values(post.categories);
              if (categoryValues.length > 0 && categoryValues[0] && typeof categoryValues[0] === 'object') {
                const firstCategory = categoryValues[0] as any;
                categoryName = firstCategory.name || 'Uncategorized';
              }
            }
            
            // Extract tags safely
            const tagsList: string[] = [];
            if (post.tags && typeof post.tags === 'object') {
              Object.values(post.tags).forEach((tag: any) => {
                if (tag && typeof tag === 'object' && tag.name) {
                  tagsList.push(tag.name);
                }
              });
            }
            
            // Extract images from post content
            const contentImages = extractImagesFromContent(post.content || '');
            
            // Extract attached images if available
            if (post.attachments && typeof post.attachments === 'object') {
              Object.values(post.attachments).forEach((attachment: any) => {
                if (attachment && attachment.URL) {
                  contentImages.push(attachment.URL);
                }
              });
            }
            
            return {
              _id: post.ID.toString(),
              title: post.title || '',
              excerpt: decodeHTMLEntities(post.excerpt || ''),
              content: decodeHTMLEntities(post.content || ''),
              author: {
                name: post.author ? post.author.name : 'Beyond2C'
              },
              publishedAt: post.date || new Date().toISOString(),
              image: post.featured_image || (contentImages.length > 0 ? contentImages[0] : ''),
              featuredImage: post.featured_image || (contentImages.length > 0 ? contentImages[0] : ''),
              images: contentImages,
              category: categoryName,
              tags: tagsList,
              slug: post.slug || '',
            };
          });
          
          // Apply category filter if provided
          let filteredPosts = transformedPosts;
          if (categoryFilter) {
            if (categoryFilter === 'exclude-voices') {
              // Exclude voices category for blog page
              filteredPosts = transformedPosts.filter(post => 
                post.category.toLowerCase() !== 'voices'
              );
            } else {
              // Include only specific category
              filteredPosts = transformedPosts.filter(post => 
                post.category.toLowerCase() === categoryFilter.toLowerCase()
              );
            }
          }
          
          setPosts(filteredPosts);
        } else {
          setPosts([]);
        }
      } catch (err) {
        console.error('Error fetching WordPress posts:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [categoryFilter]);

  return {
    posts,
    isLoading,
    error,
    getPostBySlug: (slug: string) => posts.find(post => post.slug === slug) || null
  };
}

// Add default export to ensure it can be imported either way
export default useWordPressPosts;
