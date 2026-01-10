'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Star, 
  Clock, 
  CheckCircle,
  ArrowLeft,
  MessageSquare,
  Heart,
  Share2,
  Shield,
  Calendar,
  RefreshCw,
  Package,
  User,
  MapPin
} from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import { Navbar, Footer } from '@/components/layout';
import type { Service, ServicePackage, ServiceReview } from '@/lib/types';

// Mock service data
const MOCK_SERVICE: Service = {
  id: '1',
  title: 'Desain Logo Profesional untuk Brand UMKM',
  description: `Saya akan membuat logo unik dan memorable untuk bisnis Anda.

**Apa yang Anda Dapatkan:**
- Logo custom sesuai brief
- Multiple konsep desain
- Unlimited revisi (paket Premium)
- File dalam berbagai format (PNG, JPG, SVG, AI)
- Source file & brand guidelines

**Proses Kerja:**
1. Brief & diskusi konsep
2. Riset & brainstorming
3. Sketsa awal
4. Digitalisasi & refinement
5. Revisi berdasarkan feedback
6. Final delivery

**Mengapa Memilih Saya:**
- 5+ tahun pengalaman branding
- 100+ klien puas
- Spesialisasi UMKM Indonesia
- Komunikasi responsif`,
  shortDescription: 'Logo unik dengan 3 konsep + unlimited revisi',
  providerId: '0x1234...5678',
  providerName: 'DesainPro.eth',
  providerAvatar: '/avatars/designer1.jpg',
  providerRating: 4.9,
  providerReviewCount: 127,
  category: 'design',
  tags: ['logo', 'branding', 'umkm', 'visual identity'],
  startingPrice: 50,
  currency: 'USDC',
  pricingType: 'fixed',
  packages: [
    { 
      id: 'basic', 
      name: 'Basic', 
      description: '1 konsep logo', 
      price: 50, 
      deliveryDays: 3, 
      revisions: 2, 
      features: ['1 Konsep Logo', 'File PNG/JPG', '2x Revisi', 'Resolusi Tinggi'] 
    },
    { 
      id: 'standard', 
      name: 'Standard', 
      description: '3 konsep logo + source file', 
      price: 100, 
      deliveryDays: 5, 
      revisions: 5, 
      features: ['3 Konsep Logo', 'File PNG/JPG/SVG', 'Source File (AI)', '5x Revisi', 'Color Variations'] 
    },
    { 
      id: 'premium', 
      name: 'Premium', 
      description: 'Branding lengkap', 
      price: 250, 
      deliveryDays: 7, 
      revisions: -1, 
      features: ['5 Konsep Logo', 'Semua Format File', 'Brand Guidelines', 'Unlimited Revisi', 'Social Media Kit', 'Stationery Design'] 
    },
  ],
  thumbnail: '/services/logo-design.jpg',
  gallery: ['/gallery/logo1.jpg', '/gallery/logo2.jpg', '/gallery/logo3.jpg'],
  completedOrders: 89,
  responseTime: '< 1 jam',
  status: 'active',
  featured: true,
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-03-01'),
};

// Mock reviews
const MOCK_REVIEWS: ServiceReview[] = [
  {
    id: 'r1',
    serviceId: '1',
    dealId: 'd1',
    reviewerId: '0xabc...123',
    reviewerName: 'BudiUMKM',
    rating: 5,
    comment: 'Logo yang dihasilkan sangat bagus dan sesuai dengan brief. Komunikasi lancar dan revisi cepat. Sangat recommended!',
    createdAt: new Date('2024-02-15'),
  },
  {
    id: 'r2',
    serviceId: '1',
    dealId: 'd2',
    reviewerId: '0xdef...456',
    reviewerName: 'TokoOnlineJKT',
    rating: 5,
    comment: 'Profesional banget! Hasil desain melampaui ekspektasi. Pasti order lagi untuk project berikutnya.',
    response: 'Terima kasih banyak atas reviewnya! Senang bisa membantu branding toko Anda. 🙏',
    respondedAt: new Date('2024-02-16'),
    createdAt: new Date('2024-02-14'),
  },
  {
    id: 'r3',
    serviceId: '1',
    dealId: 'd3',
    reviewerId: '0xghi...789',
    reviewerName: 'StartupBDG',
    rating: 4,
    comment: 'Hasil bagus, cuma agak lama di revisi pertama. Overall puas dengan hasilnya.',
    createdAt: new Date('2024-01-28'),
  },
];

function PackageCard({ 
  pkg, 
  isSelected, 
  onSelect 
}: { 
  pkg: ServicePackage; 
  isSelected: boolean; 
  onSelect: () => void;
}) {
  const isPopular = pkg.name === 'Standard';
  
  return (
    <Card 
      className={`relative cursor-pointer transition-all ${
        isSelected 
          ? 'ring-2 ring-primary-500 bg-primary-50/50' 
          : 'hover:border-primary-300'
      }`}
      onClick={onSelect}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-primary-500 text-white">Paling Populer</Badge>
        </div>
      )}
      
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{pkg.name}</h3>
        <p className="text-sm text-gray-500 mb-3">{pkg.description}</p>
        
        <div className="text-2xl font-bold text-primary-600 mb-4">
          ${pkg.price} <span className="text-sm font-normal text-gray-500">USDC</span>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {pkg.deliveryDays} hari
          </span>
          <span className="flex items-center gap-1">
            <RefreshCw className="w-4 h-4" />
            {pkg.revisions === -1 ? 'Unlimited' : `${pkg.revisions}x`} revisi
          </span>
        </div>
        
        <ul className="space-y-2 mb-4">
          {pkg.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        
        <Button 
          className="w-full" 
          variant={isSelected ? 'primary' : 'secondary'}
        >
          {isSelected ? 'Terpilih' : 'Pilih Paket'}
        </Button>
      </div>
    </Card>
  );
}

function ReviewCard({ review }: { review: ServiceReview }) {
  return (
    <div className="border-b pb-4 last:border-0">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
            {review.reviewerName.charAt(0)}
          </div>
          <div>
            <div className="font-medium text-sm">{review.reviewerName}</div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3 h-3 ${
                    i < review.rating 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : 'text-gray-300'
                  }`} 
                />
              ))}
            </div>
          </div>
        </div>
        <span className="text-xs text-gray-500">
          {new Date(review.createdAt).toLocaleDateString('id-ID')}
        </span>
      </div>
      
      <p className="text-sm text-gray-700 mb-2">{review.comment}</p>
      
      {review.response && (
        <div className="bg-gray-50 rounded-lg p-3 mt-2">
          <div className="text-xs text-gray-500 mb-1">Respon dari penyedia jasa:</div>
          <p className="text-sm text-gray-700">{review.response}</p>
        </div>
      )}
    </div>
  );
}

export default function ServiceDetailPage() {
  const params = useParams();
  const [selectedPackage, setSelectedPackage] = useState<string>('standard');
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
  
  const service = MOCK_SERVICE;
  const reviews = MOCK_REVIEWS;
  
  const selectedPkg = service.packages?.find(p => p.id === selectedPackage);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/marketplace" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Marketplace
        </Link>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <Card className="p-6">
              {/* Thumbnail Placeholder */}
              <div className="h-64 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-6 flex items-center justify-center">
                <Package className="w-16 h-16 text-primary-400" />
              </div>
              
              {/* Title & Provider */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {service.title}
                  </h1>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <Link href={`/profile/${service.providerId}`} className="flex items-center gap-2 hover:text-primary-600">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-medium">
                        {service.providerName.charAt(0)}
                      </div>
                      <span className="font-medium">{service.providerName}</span>
                    </Link>
                    
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{service.providerRating}</span>
                      <span className="text-gray-500">({service.providerReviewCount} ulasan)</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Stats */}
              <div className="flex flex-wrap gap-4 text-sm border-t pt-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  Respon {service.responseTime}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-4 h-4" />
                  {service.completedOrders} pesanan selesai
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  Indonesia
                </div>
              </div>
            </Card>
            
            {/* Tabs */}
            <div className="flex gap-4 border-b">
              <button
                onClick={() => setActiveTab('description')}
                className={`pb-3 px-1 text-sm font-medium transition-colors ${
                  activeTab === 'description'
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Deskripsi
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-3 px-1 text-sm font-medium transition-colors ${
                  activeTab === 'reviews'
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Ulasan ({reviews.length})
              </button>
            </div>
            
            {/* Tab Content */}
            {activeTab === 'description' ? (
              <Card className="p-6">
                <div className="prose prose-sm max-w-none">
                  {service.description.split('\n').map((paragraph, i) => {
                    if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                      return <h3 key={i} className="font-bold text-gray-900 mt-4 mb-2">{paragraph.replace(/\*\*/g, '')}</h3>;
                    }
                    if (paragraph.startsWith('- ')) {
                      return <li key={i} className="ml-4">{paragraph.substring(2)}</li>;
                    }
                    if (paragraph.match(/^\d\./)) {
                      return <li key={i} className="ml-4">{paragraph.substring(3)}</li>;
                    }
                    return paragraph ? <p key={i}>{paragraph}</p> : <br key={i} />;
                  })}
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t">
                  {service.tags.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </Card>
            ) : (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-3xl font-bold text-gray-900">{service.providerRating}</div>
                    <div className="flex items-center gap-1 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${
                            i < Math.floor(service.providerRating) 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {service.providerReviewCount} ulasan
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {reviews.map(review => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </Card>
            )}
          </div>
          
          {/* Sidebar - Packages */}
          <div className="space-y-4">
            <h2 className="font-bold text-lg">Pilih Paket</h2>
            
            {service.packages?.map(pkg => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                isSelected={selectedPackage === pkg.id}
                onSelect={() => setSelectedPackage(pkg.id)}
              />
            ))}
            
            {/* Order Summary */}
            {selectedPkg && (
              <Card className="p-4 bg-primary-50 border-primary-200">
                <h3 className="font-bold mb-3">Ringkasan Pesanan</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Paket {selectedPkg.name}</span>
                    <span>${selectedPkg.price}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Biaya platform (2%)</span>
                    <span>${(selectedPkg.price * 0.02).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span>${(selectedPkg.price * 1.02).toFixed(2)} USDC</span>
                  </div>
                </div>
                
                <Link href={`/create?service=${service.id}&package=${selectedPkg.id}`}>
                  <Button className="w-full mt-4">
                    Buat Deal Sekarang
                  </Button>
                </Link>
                
                <Button variant="secondary" className="w-full mt-2">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Hubungi Penyedia
                </Button>
              </Card>
            )}
            
            {/* Trust Badges */}
            <Card className="p-4">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                Jaminan TrustPay
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Dana aman di escrow hingga pekerjaan selesai</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Sistem milestone untuk pembayaran bertahap</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Mediasi gratis jika terjadi dispute</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>AI advisor untuk rekomendasi</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
