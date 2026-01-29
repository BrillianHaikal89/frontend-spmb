"use client";

import { BarChart3, Users as UsersIcon, School, FileCheck, TrendingUp, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { MapPin, Users, FileText, BookOpen } from 'lucide-react';

export default function HomeContent() {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const featureCards = [
    {
      id: 'penetapan-wilayah',
      title: 'Penetapan Wilayah',
      description: 'Kelola wilayah seleksi dan zonasi sekolah',
      icon: MapPin,
      bgColor: 'bg-blue-50', 
      iconBgColor: 'bg-blue-100',
      iconColor: 'text-blue-600', 
      stats: '12 Wilayah',
    },
    {
      id: 'daya-tampung',
      title: 'Daya Tampung (Swasta)',
      description: 'Kelola kuota daya tampung sekolah swasta',
      icon: Users,
      bgColor: 'bg-white',
      iconBgColor: 'bg-blue-50',
      iconColor: 'text-blue-500',
      stats: '45 Sekolah',
    },
    {
      id: 'penetapan-juknis',
      title: 'Penetapan Juknis',
      description: 'Atur petunjuk teknis seleksi',
      icon: FileText,
      bgColor: 'bg-blue-50',
      iconBgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      stats: '5 Dokumen',
    },
    {
      id: 'sk',
      title: 'SK',
      description: 'Kelola Surat Keputusan dan pengumuman',
      icon: BookOpen,
      bgColor: 'bg-white',
      iconBgColor: 'bg-blue-50',
      iconColor: 'text-blue-500',
      stats: '18 SK Aktif',
    },
  ];

  const statsCards = [
    {
      title: 'Total Pendaftar',
      value: '1,245',
      change: '+12.5%',
      icon: Users,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
      iconColor: 'bg-blue-100 text-blue-600',
      textColor: 'text-gray-900',
    },
    {
      title: 'Sekolah Terdaftar',
      value: '89',
      change: '+5.2%',
      icon: School,
      bgColor: 'bg-white',
      borderColor: 'border-blue-100',
      iconColor: 'bg-blue-50 text-blue-600',
      textColor: 'text-gray-900',
    },
    {
      title: 'Seleksi Berjalan',
      value: '23',
      change: '+8.7%',
      icon: FileCheck,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
      iconColor: 'bg-blue-100 text-blue-600',
      textColor: 'text-gray-900',
    },
    {
      title: 'Tahun Ajaran',
      value: '2026',
      icon: Calendar,
      bgColor: 'bg-white',
      borderColor: 'border-blue-100',
      iconColor: 'bg-blue-50 text-blue-600',
      textColor: 'text-gray-900',
    },
  ];

  const handleFeatureClick = (featureId: string) => {
    setSelectedFeature(featureId);
    alert(`Membuka fitur: ${featureId}`);
  };

  // Tampilkan placeholder saat masih di server
  if (!isMounted) {
    return (
      <div className="space-y-6">
        {/* Statistik Cards Placeholder */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-100 rounded-xl p-4 shadow-sm border border-gray-200 h-24 animate-pulse"
            />
          ))}
        </div>

        {/* Fitur Utama Placeholder */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-20 bg-gray-100 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>

        {/* Chart Area & Recent Activity Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
            <div className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
            <div className="space-y-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistik Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${stat.bgColor} rounded-xl p-4 shadow-sm border ${stat.borderColor}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.textColor} mt-1`}>
                    {stat.value}
                  </p>
                  {stat.change && (
                    <div className="text-xs font-medium text-green-600 mt-1 flex items-center">
                      <div suppressHydrationWarning>
                        <TrendingUp className="inline h-3 w-3 mr-1" />
                      </div>
                      <span>{stat.change} dari bulan lalu</span>
                    </div>
                  )}
                </div>
                <div className={`p-2 rounded-lg ${stat.iconColor}`}>
                  <div suppressHydrationWarning>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fitur Utama */}
      <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Fitur Utama SPMB
            </h2>
            <p className="text-sm text-gray-600">
              Kelola sistem seleksi penerimaan murid baru
            </p>
          </div>
          <div className="p-2 bg-blue-50 rounded-lg">
            <div suppressHydrationWarning>
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featureCards.map((feature) => {
            const Icon = feature.icon;
            return (
              <button
                key={feature.id}
                onClick={() => handleFeatureClick(feature.id)}
                className={`
                  group flex items-start p-4 rounded-lg border transition-all duration-200
                  ${feature.bgColor}
                  ${selectedFeature === feature.id
                    ? 'border-blue-300 bg-blue-100'
                    : 'border-blue-100 hover:bg-blue-50'
                  }
                `}
              >
                <div className={`p-2 rounded-lg ${feature.iconBgColor} mr-3`}>
                  <div suppressHydrationWarning>
                    <Icon className={`h-5 w-5 ${feature.iconColor}`} />
                  </div>
                </div>
                <div className="text-left flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
                      {feature.title}
                    </h3>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                      {feature.stats}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {feature.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart Area & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Placeholder */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            Statistik Pendaftaran
          </h3>
          <div className="h-64 flex items-center justify-center bg-blue-50 rounded-lg">
            <div className="text-center">
              <div suppressHydrationWarning>
                <BarChart3 className="h-12 w-12 text-blue-300 mx-auto mb-3" />
              </div>
              <p className="text-gray-500">Chart akan ditampilkan di sini</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            Aktivitas Terkini
          </h3>
          <div className="space-y-4">
            {[
              { action: 'Penetapan wilayah zona 5', time: '10 menit lalu', user: 'Admin' },
              { action: 'Update daya tampung sekolah swasta', time: '1 jam lalu', user: 'Operator' },
              { action: 'Upload SK baru', time: '2 jam lalu', user: 'Admin' },
              { action: 'Perbarui juknis seleksi', time: '5 jam lalu', user: 'Supervisor' },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center p-3 rounded-lg bg-blue-50"
              >
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <div suppressHydrationWarning>
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-600">
                    oleh {activity.user} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}