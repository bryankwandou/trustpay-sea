'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  CheckCircle,
  Palette,
  Code,
  FileText,
  Megaphone,
  Video,
  Languages,
  MessageSquare,
  MoreHorizontal,
  ChevronDown,
  SlidersHorizontal
} from 'lucide-react';
import { Button, Card, Input, Badge } from '@/components/ui';
import { Navbar, Footer } from '@/components/layout';
import type { Service, ServiceCategory, ServiceFilters } from '@/lib/types';

// Category icons & labels
const CATEGORIES: { key: ServiceCategory | 'all'; label: string; icon: React.ReactNode }[] = [
  { key: 'all', label: 'Semua', icon: <SlidersHorizontal className="w-4 h-4" /> },
  { key: 'design', label: 'Desain', icon: <Palette className="w-4 h-4" /> },
  { key: 'development', label: 'Development', icon: <Code className="w-4 h-4" /> },
  { key: 'writing', label: 'Penulisan', icon: <FileText className="w-4 h-4" /> },
  { key: 'marketing', label: 'Marketing', icon: <Megaphone className="w-4 h-4" /> },
  { key: 'video', label: 'Video', icon: <Video className="w-4 h-4" /> },
  { key: 'translation', label: 'Terjemahan', icon: <Languages className="w-4 h-4" /> },
  { key: 'consulting', label: 'Konsultasi', icon: <MessageSquare className="w-4 h-4" /> },
  { key: 'other', label: 'Lainnya', icon: <MoreHorizontal className="w-4 h-4" /> },
];

// Mock data - dalam production, ini akan dari blockchain/API
const MOCK_SERVICES: Service[] = [
  {
    id: '1',
    title: 'Desain Logo Profesional untuk Brand UMKM',
    description: 'Saya akan membuat logo unik dan memorable untuk bisnis Anda dengan 3 konsep awal dan unlimited revisi.',
    shortDescription: 'Logo unik dengan 3 konsep + unlimited revisi',
    providerId: '0x1234...5678',
    providerName: 'DesainPro.eth',
    providerAvatar: '/avatars/designer1.jpg',
    providerRating: 4.9,
    providerReviewCount: 127,
    category: 'design',
    tags: ['logo', 'branding', 'umkm'],
    startingPrice: 50,
    currency: 'USDC',
    pricingType: 'fixed',
    packages: [
      { id: 'basic', name: 'Basic', description: '1 konsep logo', price: 50, deliveryDays: 3, revisions: 2, features: ['1 Konsep', 'File PNG/JPG'] },
      { id: 'standard', name: 'Standard', description: '3 konsep logo', price: 100, deliveryDays: 5, revisions: 5, features: ['3 Konsep', 'File PNG/JPG/SVG', 'Source File'] },
      { id: 'premium', name: 'Premium', description: 'Branding lengkap', price: 250, deliveryDays: 7, revisions: -1, features: ['5 Konsep', 'Semua Format', 'Brand Guidelines', 'Unlimited Revisi'] },
    ],
    thumbnail: '/services/logo-design.jpg',
    gallery: [],
    completedOrders: 89,
    responseTime: '< 1 jam',
    status: 'active',
    featured: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-03-01'),
  },
  {
    id: '2',
    title: 'Website Landing Page Modern & Responsif',
    description: 'Pembuatan landing page modern dengan Next.js/React, fully responsive, optimized SEO.',
    shortDescription: 'Landing page Next.js + SEO optimized',
    providerId: '0x2345...6789',
    providerName: 'WebDev.id',
    providerAvatar: '/avatars/dev1.jpg',
    providerRating: 4.8,
    providerReviewCount: 64,
    category: 'development',
    tags: ['website', 'landing page', 'react', 'nextjs'],
    startingPrice: 150,
    currency: 'USDC',
    pricingType: 'fixed',
    packages: [
      { id: 'basic', name: 'Basic', description: '1 halaman', price: 150, deliveryDays: 5, revisions: 2, features: ['1 Halaman', 'Responsive', 'Basic SEO'] },
      { id: 'standard', name: 'Standard', description: '3-5 halaman', price: 350, deliveryDays: 10, revisions: 3, features: ['3-5 Halaman', 'Responsive', 'Full SEO', 'Contact Form'] },
      { id: 'premium', name: 'Premium', description: 'Full website', price: 750, deliveryDays: 21, revisions: 5, features: ['10+ Halaman', 'CMS', 'Full SEO', 'Analytics', '3 Bulan Support'] },
    ],
    thumbnail: '/services/web-dev.jpg',
    gallery: [],
    completedOrders: 42,
    responseTime: '< 2 jam',
    status: 'active',
    featured: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-03-05'),
  },
  {
    id: '3',
    title: 'Penulisan Artikel SEO Bahasa Indonesia',
    description: 'Artikel berkualitas tinggi untuk blog/website, SEO friendly, plagiarism free.',
    shortDescription: 'Artikel SEO friendly, 100% original',
    providerId: '0x3456...7890',
    providerName: 'ContentID',
    providerAvatar: '/avatars/writer1.jpg',
    providerRating: 4.7,
    providerReviewCount: 203,
    category: 'writing',
    tags: ['artikel', 'seo', 'blog', 'copywriting'],
    startingPrice: 15,
    currency: 'USDC',
    pricingType: 'fixed',
    packages: [
      { id: 'basic', name: 'Basic', description: '500 kata', price: 15, deliveryDays: 2, revisions: 1, features: ['500 Kata', 'SEO Basic', '1 Revisi'] },
      { id: 'standard', name: 'Standard', description: '1000 kata', price: 25, deliveryDays: 3, revisions: 2, features: ['1000 Kata', 'SEO Optimized', 'Gambar', '2 Revisi'] },
      { id: 'premium', name: 'Premium', description: '2000 kata', price: 45, deliveryDays: 5, revisions: 3, features: ['2000 Kata', 'Full SEO', 'Gambar', 'Meta Tags', '3 Revisi'] },
    ],
    thumbnail: '/services/content-writing.jpg',
    gallery: [],
    completedOrders: 156,
    responseTime: '< 30 menit',
    status: 'active',
    featured: false,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-03-10'),
  },
  {
    id: '4',
    title: 'Social Media Management 1 Bulan',
    description: 'Kelola akun sosmed bisnis Anda: content creation, posting schedule, engagement.',
    shortDescription: 'Full social media management',
    providerId: '0x4567...8901',
    providerName: 'SocialBoost',
    providerAvatar: '/avatars/marketer1.jpg',
    providerRating: 4.6,
    providerReviewCount: 78,
    category: 'marketing',
    tags: ['social media', 'instagram', 'tiktok', 'content'],
    startingPrice: 200,
    currency: 'USDC',
    pricingType: 'milestone',
    thumbnail: '/services/social-media.jpg',
    gallery: [],
    completedOrders: 34,
    responseTime: '< 3 jam',
    status: 'active',
    featured: false,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-03-08'),
  },
  {
    id: '5',
    title: 'Video Editing Profesional untuk YouTube',
    description: 'Edit video YouTube dengan transisi smooth, color grading, dan thumbnail.',
    shortDescription: 'Video editing + thumbnail YouTube',
    providerId: '0x5678...9012',
    providerName: 'EditMaster',
    providerAvatar: '/avatars/editor1.jpg',
    providerRating: 4.9,
    providerReviewCount: 91,
    category: 'video',
    tags: ['video editing', 'youtube', 'thumbnail'],
    startingPrice: 30,
    currency: 'USDC',
    pricingType: 'fixed',
    packages: [
      { id: 'basic', name: 'Basic', description: 'Video < 5 menit', price: 30, deliveryDays: 2, revisions: 1, features: ['Video < 5 menit', 'Basic Cuts', 'Music'] },
      { id: 'standard', name: 'Standard', description: 'Video < 15 menit', price: 60, deliveryDays: 4, revisions: 2, features: ['Video < 15 menit', 'Transitions', 'Color Grade', 'Thumbnail'] },
      { id: 'premium', name: 'Premium', description: 'Video < 30 menit', price: 120, deliveryDays: 7, revisions: 3, features: ['Video < 30 menit', 'Motion Graphics', 'Full Edit', 'Subtitle', 'Thumbnail'] },
    ],
    thumbnail: '/services/video-edit.jpg',
    gallery: [],
    completedOrders: 67,
    responseTime: '< 1 jam',
    status: 'active',
    featured: true,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-03-12'),
  },
  {
    id: '6',
    title: 'Terjemahan Dokumen Inggris-Indonesia',
    description: 'Terjemahan profesional untuk dokumen bisnis, legal, atau teknis.',
    shortDescription: 'Terjemahan profesional EN-ID',
    providerId: '0x6789...0123',
    providerName: 'TranslateID',
    providerAvatar: '/avatars/translator1.jpg',
    providerRating: 4.8,
    providerReviewCount: 145,
    category: 'translation',
    tags: ['translation', 'english', 'indonesia', 'document'],
    startingPrice: 10,
    currency: 'USDC',
    pricingType: 'fixed',
    packages: [
      { id: 'basic', name: 'Basic', description: '500 kata', price: 10, deliveryDays: 1, revisions: 1, features: ['500 Kata', 'General Translation'] },
      { id: 'standard', name: 'Standard', description: '1500 kata', price: 25, deliveryDays: 2, revisions: 2, features: ['1500 Kata', 'Proofreading', 'Formatting'] },
      { id: 'premium', name: 'Premium', description: '3000 kata', price: 45, deliveryDays: 3, revisions: 3, features: ['3000 Kata', 'Technical/Legal', 'Certificate'] },
    ],
    thumbnail: '/services/translation.jpg',
    gallery: [],
    completedOrders: 112,
    responseTime: '< 2 jam',
    status: 'active',
    featured: false,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-03-15'),
  },
];

// Service Card Component
function ServiceCard({ service }: { service: Service }) {
  return (
    <Link href={`/marketplace/${service.id}`}>
      <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden group">
        {/* Thumbnail */}
        <div className="relative h-40 bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            {CATEGORIES.find(c => c.key === service.category)?.icon && (
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-primary-600 scale-150">
                  {CATEGORIES.find(c => c.key === service.category)?.icon}
                </span>
              </div>
            )}
          </div>
          {service.featured && (
            <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
              ⭐ Featured
            </Badge>
          )}
        </div>
        
        {/* Content */}
        <div className="p-4">
          {/* Provider Info */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
              {service.providerName.charAt(0)}
            </div>
            <span className="text-sm text-gray-600 truncate">{service.providerName}</span>
            <div className="flex items-center gap-1 ml-auto">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">{service.providerRating}</span>
              <span className="text-xs text-gray-400">({service.providerReviewCount})</span>
            </div>
          </div>
          
          {/* Title */}
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">
            {service.title}
          </h3>
          
          {/* Short Description */}
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
            {service.shortDescription}
          </p>
          
          {/* Stats */}
          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {service.responseTime}
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              {service.completedOrders} selesai
            </span>
          </div>
          
          {/* Price */}
          <div className="border-t pt-3 flex items-center justify-between">
            <span className="text-xs text-gray-500">Mulai dari</span>
            <span className="font-bold text-primary-600">
              ${service.startingPrice} {service.currency}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default function MarketplacePage() {
  const [filters, setFilters] = useState<ServiceFilters>({
    sortBy: 'popular'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filter services
  const filteredServices = useMemo(() => {
    let result = [...MOCK_SERVICES];
    
    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(s => s.category === selectedCategory);
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.title.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.tags.some(t => t.toLowerCase().includes(query))
      );
    }
    
    // Price filter
    if (filters.minPrice) {
      result = result.filter(s => s.startingPrice >= filters.minPrice!);
    }
    if (filters.maxPrice) {
      result = result.filter(s => s.startingPrice <= filters.maxPrice!);
    }
    
    // Rating filter
    if (filters.minRating) {
      result = result.filter(s => s.providerRating >= filters.minRating!);
    }
    
    // Sort
    switch (filters.sortBy) {
      case 'newest':
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'price_low':
        result.sort((a, b) => a.startingPrice - b.startingPrice);
        break;
      case 'price_high':
        result.sort((a, b) => b.startingPrice - a.startingPrice);
        break;
      case 'rating':
        result.sort((a, b) => b.providerRating - a.providerRating);
        break;
      case 'popular':
      default:
        result.sort((a, b) => b.completedOrders - a.completedOrders);
    }
    
    return result;
  }, [filters, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Marketplace Jasa Freelancer
            </h1>
            <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
              Temukan freelancer terpercaya untuk proyek Anda. Pembayaran aman dengan escrow.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari jasa, misalnya: desain logo, website, artikel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 shadow-lg focus:ring-2 focus:ring-primary-300 outline-none"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === cat.key
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.icon}
                <span className="text-sm font-medium">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            <span className="font-semibold">{filteredServices.length}</span> jasa ditemukan
          </p>
          
          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as ServiceFilters['sortBy'] })}
                className="appearance-none bg-white border rounded-lg px-4 py-2 pr-10 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              >
                <option value="popular">Paling Populer</option>
                <option value="newest">Terbaru</option>
                <option value="rating">Rating Tertinggi</option>
                <option value="price_low">Harga Terendah</option>
                <option value="price_high">Harga Tertinggi</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            
            {/* Filter Button */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-white rounded-xl p-4 mb-6 shadow-sm border"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Harga Min ($)
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.minPrice || ''}
                  onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) || undefined })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Harga Max ($)
                </label>
                <Input
                  type="number"
                  placeholder="1000"
                  value={filters.maxPrice || ''}
                  onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) || undefined })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating Minimum
                </label>
                <select
                  value={filters.minRating || ''}
                  onChange={(e) => setFilters({ ...filters, minRating: Number(e.target.value) || undefined })}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Semua Rating</option>
                  <option value="4.5">4.5+ ⭐</option>
                  <option value="4">4+ ⭐</option>
                  <option value="3.5">3.5+ ⭐</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setFilters({ sortBy: 'popular' })}
                  className="w-full"
                >
                  Reset Filter
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ServiceCard service={service} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Tidak ada jasa ditemukan
            </h3>
            <p className="text-gray-500 mb-4">
              Coba ubah filter atau kata kunci pencarian Anda
            </p>
            <Button variant="secondary" onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setFilters({ sortBy: 'popular' });
            }}>
              Reset Pencarian
            </Button>
          </div>
        )}

        {/* CTA Section */}
        <section className="mt-16 bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">
            Punya Keahlian? Mulai Jual Jasa Anda
          </h2>
          <p className="text-primary-100 mb-6 max-w-xl mx-auto">
            Bergabung dengan ribuan freelancer yang sudah mendapatkan bayaran aman melalui TrustPay SEA
          </p>
          <Link href="/create-service">
            <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
              Buat Jasa Baru
            </Button>
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
