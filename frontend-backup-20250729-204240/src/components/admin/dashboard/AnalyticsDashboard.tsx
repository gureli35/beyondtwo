import React, { useState, useEffect } from 'react';
import { DashboardChart } from './DashboardChart';

interface AnalyticsData {
  pageViews: {
    total: number;
    change: number;
    data: number[];
    labels: string[];
  };
  uniqueVisitors: {
    total: number;
    change: number;
    data: number[];
    labels: string[];
  };
  bounceRate: {
    rate: number;
    change: number;
  };
  avgSessionDuration: {
    duration: string;
    change: number;
  };
  topPages: Array<{
    path: string;
    views: number;
    change: number;
  }>;
  trafficSources: Array<{
    source: string;
    visitors: number;
    percentage: number;
  }>;
}

const AnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate mock data based on time range
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const labels = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' });
    });

    const generateRandomData = (min: number, max: number) => 
      Array.from({ length: days }, () => Math.floor(Math.random() * (max - min + 1)) + min);

    const mockData: AnalyticsData = {
      pageViews: {
        total: 15678 + Math.floor(Math.random() * 5000),
        change: Math.floor(Math.random() * 30) + 5,
        data: generateRandomData(100, 500),
        labels,
      },
      uniqueVisitors: {
        total: 8934 + Math.floor(Math.random() * 2000),
        change: Math.floor(Math.random() * 25) + 3,
        data: generateRandomData(50, 300),
        labels,
      },
      bounceRate: {
        rate: 0.45 + Math.random() * 0.2,
        change: (Math.random() - 0.5) * 10,
      },
      avgSessionDuration: {
        duration: `${Math.floor(Math.random() * 5) + 2}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        change: (Math.random() - 0.5) * 20,
      },
      topPages: [
        { path: '/', views: 3421, change: 12.5 },
        { path: '/blog', views: 2156, change: 8.2 },
        { path: '/about', views: 1834, change: -2.1 },
        { path: '/impact-map', views: 1567, change: 15.3 },
        { path: '/resources', views: 1234, change: 5.7 },
      ],
      trafficSources: [
        { source: 'Organik Arama', visitors: 4523, percentage: 45.2 },
        { source: 'Doğrudan Trafik', visitors: 2341, percentage: 23.4 },
        { source: 'Sosyal Medya', visitors: 1567, percentage: 15.7 },
        { source: 'Referral', visitors: 987, percentage: 9.9 },
        { source: 'Email', visitors: 582, percentage: 5.8 },
      ],
    };

    setAnalyticsData(mockData);
    setLoading(false);
  };

  if (loading || !analyticsData) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: analyticsData.pageViews.labels,
    datasets: [
      {
        label: 'Sayfa Görüntüleme',
        data: analyticsData.pageViews.data,
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Benzersiz Ziyaretçi',
        data: analyticsData.uniqueVisitors.data,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
        <div className="flex space-x-2">
          {[
            { value: '7d', label: 'Son 7 Gün' },
            { value: '30d', label: 'Son 30 Gün' },
            { value: '90d', label: 'Son 90 Gün' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setTimeRange(option.value as any)}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                timeRange === option.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-lg">👁️</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Sayfa Görüntüleme
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {analyticsData.pageViews.total.toLocaleString()}
                  </dd>
                  <dd className={`text-sm ${analyticsData.pageViews.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {analyticsData.pageViews.change >= 0 ? '+' : ''}{analyticsData.pageViews.change.toFixed(1)}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-emerald-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-lg">👥</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Benzersiz Ziyaretçi
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {analyticsData.uniqueVisitors.total.toLocaleString()}
                  </dd>
                  <dd className={`text-sm ${analyticsData.uniqueVisitors.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {analyticsData.uniqueVisitors.change >= 0 ? '+' : ''}{analyticsData.uniqueVisitors.change.toFixed(1)}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-amber-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-lg">⚡</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Çıkış Oranı
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {(analyticsData.bounceRate.rate * 100).toFixed(1)}%
                  </dd>
                  <dd className={`text-sm ${analyticsData.bounceRate.change <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {analyticsData.bounceRate.change >= 0 ? '+' : ''}{analyticsData.bounceRate.change.toFixed(1)}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-lg">⏱️</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Ort. Oturum Süresi
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {analyticsData.avgSessionDuration.duration}
                  </dd>
                  <dd className={`text-sm ${analyticsData.avgSessionDuration.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {analyticsData.avgSessionDuration.change >= 0 ? '+' : ''}{analyticsData.avgSessionDuration.change.toFixed(1)}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Traffic Chart */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Trafik Analizi</h3>
        </div>
        <DashboardChart data={chartData} />
      </div>

      {/* Two-column layout for additional metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Popüler Sayfalar</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {analyticsData.topPages.map((page, index) => (
              <div key={page.path} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{page.path}</p>
                    <p className="text-sm text-gray-500">{page.views.toLocaleString()} görüntüleme</p>
                  </div>
                  <div className={`text-sm font-medium ${page.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {page.change >= 0 ? '+' : ''}{page.change.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Trafik Kaynakları</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {analyticsData.trafficSources.map((source) => (
              <div key={source.source} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{source.source}</p>
                    <div className="mt-1 flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${source.percentage}%` }}
                        ></div>
                      </div>
                      <span className="ml-3 text-sm text-gray-500">
                        {source.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 text-sm font-medium text-gray-900">
                    {source.visitors.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
