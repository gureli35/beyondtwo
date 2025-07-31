import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import AdvancedVoiceEditor from '@/components/admin/content/AdvancedVoiceEditor';
import { useToast } from '@/context/ToastContext';

interface VoiceFormData {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category: string;
  tags?: string;
  featuredImage?: string;
  status: 'draft' | 'submitted' | 'reviewed' | 'published' | 'rejected' | 'archived';
  storyType: 'personal' | 'community' | 'project' | 'campaign' | 'research';
  author: {
    name: string;
    age?: number;
    location: {
      city?: string;
      region?: string;
      country?: string;
    };
    bio?: string;
    image?: string;
  };
  impact?: {
    description?: string;
    metrics?: Array<{
      name: string;
      value: string;
      unit: string;
    }>;
    beneficiaries?: number;
    timeframe?: string;
  };
  callToAction?: string;
  contact?: {
    email?: string;
    phone?: string;
    website?: string;
    social?: {
      instagram?: string;
      twitter?: string;
      linkedin?: string;
      youtube?: string;
    };
  };
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  allowComments?: boolean;
  allowSharing?: boolean;
  showAuthorContact?: boolean;
  featured?: boolean;
  publishedAt?: string;
  language?: 'tr' | 'en';
  readingTime?: number;
}

const AdminVoiceCreatePage: React.FC = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);

  const handleSave = async (data: VoiceFormData) => {
    try {
      setSaving(true);
      
      console.log('Sending voice data:', data); // Debug log

      const response = await fetch('/api/admin/voices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      console.log('API Response:', result); // Debug log

      if (result.success) {
        showToast('Voice/Story created successfully!', 'success');
        router.push(`/admin/voices/edit/${result.data._id}`);
      } else {
        console.error('API Error:', result); // Debug log
        showToast(result.message || 'Error creating voice/story', 'error');
      }
    } catch (error) {
      console.error('Network Error:', error); // Debug log
      showToast('Error creating voice/story', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      router.push('/admin/voices');
    }
  };

  return (
    <AdminLayout>
      <Head>
        <title>Create Voice | Beyond2C Admin</title>
      </Head>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Yeni Hikaye Oluştur</h1>
            <p className="text-gray-600">Gençlerin iklim hikayelerini paylaşın</p>
          </div>
          
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            ← Geri Dön
          </button>
        </div>

        {/* Editor */}
        <AdvancedVoiceEditor
          mode="create"
          onSave={handleSave}
          onCancel={handleCancel}
          saving={saving}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminVoiceCreatePage;
