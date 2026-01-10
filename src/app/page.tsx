import Link from 'next/link'
import { 
  Shield, 
  CheckCircle, 
  Clock, 
  Users, 
  ArrowRight,
  FileText,
  Wallet,
  ThumbsUp,
  Sparkles,
  Star,
  Zap,
  Globe,
  Lock,
  BadgeCheck,
  Briefcase,
  Building2,
  UserCheck,
  ChevronRight,
  Play,
  CircleDollarSign,
  ShieldCheck
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* === HERO SECTION === */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-50/30">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        
        <div className="container-main relative py-20 md:py-28 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-card border border-primary-100 mb-8 animate-fade-in">
              <ShieldCheck className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-neutral-700">
                Powered by Lisk Blockchain • AI-Assisted
              </span>
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-success-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success-500"></span>
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-neutral-900 mb-6 tracking-tight animate-slide-up">
              Get Paid Safely
              <br />
              <span className="bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
                For Your Work
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Milestone-based escrow payments for freelancers and SMEs in Southeast Asia.
              <span className="block text-neutral-500 mt-2">
                Your money is protected until work is delivered. Simple as that.
              </span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link 
                href="/create" 
                className="group btn-primary text-lg px-8 py-4 w-full sm:w-auto shadow-lg hover:shadow-xl transition-all"
              >
                Create Secure Deal
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/how-it-works" 
                className="btn-secondary text-lg px-8 py-4 w-full sm:w-auto flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                See How It Works
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-3xl mx-auto">
              <StatItem value="$2.5M+" label="Protected" />
              <StatItem value="1,200+" label="Deals Done" />
              <StatItem value="99.2%" label="Success Rate" />
              <StatItem value="< 2%" label="Platform Fee" />
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 50L60 45.7C120 41 240 33 360 35.8C480 39 600 53 720 55.2C840 57 960 47 1080 43.3C1200 39 1320 41 1380 41.8L1440 43V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0V50Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* === HOW IT WORKS === */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container-main">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-600 text-sm font-semibold rounded-full mb-4">
              Simple Process
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
              3 Steps to Secure Payments
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              No complicated steps. No crypto jargon. Just create, fund, and get paid.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <StepCard 
              number={1}
              icon={<FileText className="w-8 h-8" />}
              iconBg="bg-primary-100"
              iconColor="text-primary-600"
              title="Create Your Deal"
              description="Set project name, milestones, and payment amounts. Just like creating an invoice."
            />
            <StepCard 
              number={2}
              icon={<Wallet className="w-8 h-8" />}
              iconBg="bg-success-100"
              iconColor="text-success-600"
              title="Funds Are Protected"
              description="Client deposits payment. Money is locked and safe until work is approved."
            />
            <StepCard 
              number={3}
              icon={<ThumbsUp className="w-8 h-8" />}
              iconBg="bg-warning-100"
              iconColor="text-warning-600"
              title="Approve & Get Paid"
              description="Client approves completed work. Payment is released instantly."
            />
          </div>
          
          {/* Arrow connecting steps */}
          <div className="hidden md:flex justify-center items-center gap-4 mt-8">
            <div className="w-24 h-[2px] bg-gradient-to-r from-primary-200 to-success-200" />
            <ChevronRight className="w-6 h-6 text-neutral-300" />
            <div className="w-24 h-[2px] bg-gradient-to-r from-success-200 to-warning-200" />
            <ChevronRight className="w-6 h-6 text-neutral-300" />
            <div className="w-24 h-[2px] bg-warning-200" />
          </div>
        </div>
      </section>

      {/* === WHO IT'S FOR === */}
      <section className="py-20 md:py-28 bg-neutral-50">
        <div className="container-main">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-success-100 text-success-700 text-sm font-semibold rounded-full mb-4">
              Built for SEA
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
              Perfect For Your Business
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Whether you&apos;re a solo freelancer or running an agency, TrustPay keeps your payments safe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <UserTypeCard 
              icon={<UserCheck className="w-10 h-10" />}
              title="Freelancers"
              description="No more ghosted payments. Get paid milestone by milestone as you complete the work."
              benefits={["Guaranteed payments", "Build client trust", "Clear milestones"]}
            />
            <UserTypeCard 
              icon={<Building2 className="w-10 h-10" />}
              title="Agencies"
              description="Manage multiple projects with clear payment structures and client accountability."
              benefits={["Project tracking", "Team collaboration", "Payment transparency"]}
            />
            <UserTypeCard 
              icon={<Briefcase className="w-10 h-10" />}
              title="SME Clients"
              description="Pay only for completed work. Full visibility into project progress."
              benefits={["Work verification", "Budget control", "Quality assurance"]}
            />
          </div>
        </div>
      </section>

      {/* === AI ASSISTANT SECTION === */}
      <section className="py-20 md:py-28 bg-white overflow-hidden">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-ai-bg border border-ai-border px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-ai-accent" />
                <span className="text-sm font-semibold text-ai-accent">AI-Powered Analysis</span>
              </div>
              
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-6 leading-tight">
                Smart Guidance,
                <br />
                <span className="text-primary-500">Your Decision</span>
              </h2>
              
              <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                Our AI analyzes submissions and gives honest recommendations — but 
                <strong className="text-neutral-900"> the final approval is always yours</strong>. 
                You stay in complete control.
              </p>

              <ul className="space-y-5">
                <AIFeature 
                  title="Analyzes work submissions"
                  description="Checks if deliverables match your requirements"
                />
                <AIFeature 
                  title="Gives confidence scores"
                  description="Helps you understand submission quality at a glance"
                />
                <AIFeature 
                  title="Explains its reasoning"
                  description="Transparent analysis you can verify yourself"
                />
                <AIFeature 
                  title="Never makes final decisions"
                  description="All approvals require your explicit action"
                />
              </ul>
            </div>

            {/* AI Box Preview */}
            <div className="relative">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-100 rounded-full blur-3xl opacity-60" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-ai-accent/20 rounded-full blur-3xl" />
              
              <div className="relative bg-white rounded-2xl shadow-elevated border border-neutral-200 p-6 max-w-md mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-ai-bg rounded-lg flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-ai-accent" />
                    </div>
                    <span className="font-semibold text-neutral-900">AI Analysis</span>
                  </div>
                  <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-1 rounded-full">
                    Just now
                  </span>
                </div>
                
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-success-50 border border-success-200 rounded-full mb-4">
                  <CheckCircle className="w-4 h-4 text-success-600" />
                  <span className="text-sm font-medium text-success-700">Looks Good</span>
                </div>
                
                <p className="text-neutral-700 mb-5">
                  This submission meets the milestone requirements. All 15 pages from design have been implemented with responsive layouts.
                </p>
                
                <div className="mb-5">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-neutral-500">Confidence Score</span>
                    <span className="font-bold text-success-600">87%</span>
                  </div>
                  <div className="h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-success-400 to-success-500 rounded-full" style={{ width: '87%' }} />
                  </div>
                </div>
                
                <div className="p-4 bg-warning-50 border border-warning-200 rounded-xl text-sm text-warning-800">
                  <strong className="text-warning-900">⚠️ Remember:</strong> This is a recommendation only. 
                  <span className="block mt-1 font-medium">Final decision is yours.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === TRUST FEATURES === */}
      <section className="py-20 md:py-28 bg-neutral-50">
        <div className="container-main">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-600 text-sm font-semibold rounded-full mb-4">
              Why Choose Us
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
              Built for Trust
            </h2>
            <p className="text-lg text-neutral-600">
              Every feature designed to protect both freelancers and clients
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <FeatureCard icon={<Lock className="w-7 h-7" />} iconColor="text-primary-500" title="Protected Funds" description="Money is locked in secure smart contracts. No one can touch it until terms are met." />
            <FeatureCard icon={<Clock className="w-7 h-7" />} iconColor="text-primary-500" title="Milestone Tracking" description="Break projects into smaller payments. Get paid as you complete each phase." />
            <FeatureCard icon={<Users className="w-7 h-7" />} iconColor="text-primary-500" title="Fair Disputes" description="Disagreements? Both parties present their case. Optional mediator available." />
            <FeatureCard icon={<Sparkles className="w-7 h-7" />} iconColor="text-ai-accent" title="AI Analysis" description="Smart recommendations on submissions. AI helps guide, you decide." />
            <FeatureCard icon={<Zap className="w-7 h-7" />} iconColor="text-success-500" title="Instant Release" description="Approve work and receive payment immediately. No waiting periods." />
            <FeatureCard icon={<BadgeCheck className="w-7 h-7" />} iconColor="text-warning-500" title="Full Transparency" description="Every action recorded on blockchain. Full audit trail for both parties." />
          </div>
        </div>
      </section>

      {/* === TESTIMONIALS === */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container-main">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-warning-100 text-warning-700 text-sm font-semibold rounded-full mb-4">
              Success Stories
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
              Loved by Freelancers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <TestimonialCard quote="Finally, I don't have to worry about clients disappearing. My money is safe until I deliver." name="Andi Rizky" role="Web Developer" location="Jakarta" initials="AR" bgColor="bg-primary-100" textColor="text-primary-600" />
            <TestimonialCard quote="The milestone system is perfect for big projects. I get paid step by step, no stress." name="Sarah Putri" role="UI Designer" location="Singapore" initials="SP" bgColor="bg-success-100" textColor="text-success-600" />
            <TestimonialCard quote="As a client, I feel confident that I only pay when work is actually done right." name="Budi Tanjung" role="UMKM Owner" location="Bandung" initials="BT" bgColor="bg-warning-100" textColor="text-warning-600" />
          </div>
        </div>
      </section>

      {/* === PRICING TEASER === */}
      <section className="py-20 md:py-28 bg-neutral-50">
        <div className="container-main">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 bg-success-100 text-success-700 text-sm font-semibold rounded-full mb-4">
              Transparent Pricing
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
              Simple, Fair Pricing
            </h2>
            <p className="text-lg text-neutral-600 mb-12">
              Only 2% platform fee. No hidden charges. No subscription required.
            </p>
            
            <div className="bg-white rounded-3xl shadow-elevated border border-neutral-200 p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                <div className="text-center">
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-5xl md:text-6xl font-bold text-neutral-900">2</span>
                    <span className="text-2xl md:text-3xl font-bold text-neutral-400">%</span>
                  </div>
                  <p className="text-neutral-600">Platform Fee</p>
                </div>
                
                <div className="hidden md:block w-px h-20 bg-neutral-200" />
                
                <div className="text-center">
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-5xl md:text-6xl font-bold text-neutral-900">$0</span>
                  </div>
                  <p className="text-neutral-600">Monthly Subscription</p>
                </div>
                
                <div className="hidden md:block w-px h-20 bg-neutral-200" />
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <CircleDollarSign className="w-12 h-12 text-success-500" />
                  </div>
                  <p className="text-neutral-600">Pay Per Use</p>
                </div>
              </div>
              
              <div className="mt-10 pt-8 border-t border-neutral-100">
                <Link href="/pricing" className="btn-secondary px-8 py-3">
                  View Full Pricing Details
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === CTA SECTION === */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/grid-white.svg')] bg-center" />
        </div>
        
        <div className="container-main relative text-center">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to Get Paid Safely?
          </h2>
          <p className="text-lg md:text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
            Create your first secure deal in less than 2 minutes. 
            No signup required — just connect your wallet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/create" 
              className="group inline-flex items-center gap-2 bg-white text-primary-600 font-bold px-8 py-4 rounded-xl hover:bg-primary-50 transition-all shadow-elevated text-lg"
            >
              Create Your First Deal
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-2 text-white/90 hover:text-white font-medium px-6 py-4 transition-colors"
            >
              View Demo Dashboard
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
          
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-primary-200 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Smart Contract Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>Built for Southeast Asia</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>AI-Assisted Analysis</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

// === COMPONENTS ===

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="font-display text-2xl md:text-3xl font-bold text-neutral-900">{value}</p>
      <p className="text-sm text-neutral-500 mt-1">{label}</p>
    </div>
  )
}

function StepCard({ number, icon, iconBg, iconColor, title, description }: { 
  number: number; icon: React.ReactNode; iconBg: string; iconColor: string; title: string; description: string 
}) {
  return (
    <div className="card text-center group hover:shadow-card-hover transition-all duration-300">
      <div className={`w-16 h-16 ${iconBg} rounded-2xl flex items-center justify-center mx-auto mb-6 ${iconColor} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div className="inline-flex items-center justify-center w-8 h-8 bg-primary-500 text-white font-bold text-sm rounded-full mb-4 shadow-md">
        {number}
      </div>
      <h3 className="font-display text-xl font-semibold text-neutral-900 mb-3">{title}</h3>
      <p className="text-neutral-600">{description}</p>
    </div>
  )
}

function UserTypeCard({ icon, title, description, benefits }: { 
  icon: React.ReactNode; title: string; description: string; benefits: string[]
}) {
  return (
    <div className="card group hover:shadow-card-hover hover:border-primary-200 transition-all duration-300">
      <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-5 text-primary-600 group-hover:bg-primary-500 group-hover:text-white transition-colors">
        {icon}
      </div>
      <h3 className="font-display text-xl font-semibold text-neutral-900 mb-3">{title}</h3>
      <p className="text-neutral-600 mb-5">{description}</p>
      <ul className="space-y-2">
        {benefits.map((benefit, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-neutral-600">
            <CheckCircle className="w-4 h-4 text-success-500 flex-shrink-0" />
            {benefit}
          </li>
        ))}
      </ul>
    </div>
  )
}

function AIFeature({ title, description }: { title: string; description: string }) {
  return (
    <li className="flex items-start gap-4">
      <div className="w-6 h-6 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
        <CheckCircle className="w-4 h-4 text-success-600" />
      </div>
      <div>
        <p className="font-semibold text-neutral-900">{title}</p>
        <p className="text-sm text-neutral-500">{description}</p>
      </div>
    </li>
  )
}

function FeatureCard({ icon, iconColor, title, description }: { 
  icon: React.ReactNode; iconColor: string; title: string; description: string 
}) {
  return (
    <div className="card group hover:shadow-card-hover transition-all duration-300">
      <div className={`${iconColor} mb-4`}>{icon}</div>
      <h3 className="font-semibold text-lg text-neutral-900 mb-2">{title}</h3>
      <p className="text-neutral-600 text-sm leading-relaxed">{description}</p>
    </div>
  )
}

function TestimonialCard({ quote, name, role, location, initials, bgColor, textColor }: {
  quote: string; name: string; role: string; location: string; initials: string; bgColor: string; textColor: string;
}) {
  return (
    <div className="card">
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 text-warning-400 fill-warning-400" />
        ))}
      </div>
      <p className="text-neutral-700 mb-6 leading-relaxed">&ldquo;{quote}&rdquo;</p>
      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 ${bgColor} rounded-full flex items-center justify-center`}>
          <span className={`font-bold ${textColor}`}>{initials}</span>
        </div>
        <div>
          <p className="font-semibold text-neutral-900">{name}</p>
          <p className="text-sm text-neutral-500">{role}, {location}</p>
        </div>
      </div>
    </div>
  )
}
