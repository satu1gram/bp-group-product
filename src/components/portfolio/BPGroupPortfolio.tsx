// Portfolio Component - BP Group Product Catalog
// Implementasi langsung untuk website portfolio

import React from 'react';

interface PortfolioSection {
  language: 'id' | 'en';
}

export const BPGroupPortfolio: React.FC<PortfolioSection> = ({ language }) => {
  const content = {
    id: {
      title: "BP Group Product Catalog",
      subtitle: "AI-Powered Health & Business Marketplace",
      tags: ["React", "TypeScript", "Supabase", "Tailwind", "RAG AI"],
      
      challenge: {
        title: "CHALLENGE",
        content: `Produk kesehatan berkualitas tinggi dari BP Group memiliki demand tinggi, 
namun penjualan online terhambat oleh:

• Calon pembeli ragu memilih produk yang tepat—testimoni tersebar di berbagai channel
• Tidak ada mekanisme menampilkan bukti kesembuhan yang RELEVAN per individu
• Interface katalog standar tidak mampu memberikan saran personal
• Sistem pricing multi-tier (Retail/Reseller/Agen) rumit dan sulit dijelaskan
• Mobile users (mayoritas) mengalami friction saat browsing dan checkout`
      },

      solution: {
        title: "SOLUTION",
        content: `Platform e-commerce dengan "Quantum Insight Engine"—AI yang mampu:

🧠 Recommendation Engine (RAG-Based)
   AI Advisor memahami keluhan user, menemukan testimoni yang MATCH, 
   memberikan rekomendasi berbasis bukti nyata.

📱 Mobile-First Catalog
   50+ produk dengan benefit jelas, pricing tier dinamis, gesture navigation.

🌍 Community-Powered Testimonials
   27k+ testimoni terintegrasi dari Telegram dengan relevance scoring.

💰 Seamless Conversion Funnel
   User journey: Browse → Ask AI → View Proof → WhatsApp Close`
      },

      features: [
        {
          icon: "✨",
          title: "AI-Powered Recommendation Engine",
          desc: "Analisis keluhan user + rekomendasi produk dengan bukti"
        },
        {
          icon: "📱",
          title: "Mobile-First Design & PWA",
          desc: "Optimized untuk Indonesia, offline support, install-to-home"
        },
        {
          icon: "💳",
          title: "Multi-Tier Pricing System",
          desc: "Dynamic pricing untuk Retail/Reseller/Agen"
        },
        {
          icon: "🌍",
          title: "Real-Time Community Insights",
          desc: "Live testimoni, geographic distribution, success matching"
        },
        {
          icon: "⚡",
          title: "High-Performance Data Layer",
          desc: "React Query caching, vector embeddings, resilient API"
        },
        {
          icon: "🔐",
          title: "Enterprise-Grade Security",
          desc: "Supabase RLS, rate limiting, GDPR-compliant"
        }
      ],

      role: {
        title: "OUR ROLE",
        teams: [
          {
            name: "Full-Stack Development",
            items: [
              "Frontend: React 18 + TypeScript + Tailwind CSS",
              "Custom hooks untuk state management",
              "Supabase integration & realtime sync",
              "Vector embeddings untuk RAG",
              "Vite build optimization & PWA"
            ]
          },
          {
            name: "UI/UX Design",
            items: [
              "Design system Tailwind + shadcn/ui",
              "Mobile gesture design",
              "WCAG 2.1 accessibility",
              "Loading states & animations"
            ]
          },
          {
            name: "AI/ML Integration",
            items: [
              "RAG (Retrieval-Augmented Generation)",
              "Vector embedding pipeline",
              "Prompt engineering",
              "Context management"
            ]
          },
          {
            name: "Data Engineering",
            items: [
              "Telegram scraper & normalizer",
              "Schema design untuk queries multi-dimensional",
              "Vector indexing & similarity search",
              "Real-time sync"
            ]
          }
        ]
      },

      techStack: {
        title: "TECHNICAL STACK",
        stacks: [
          { category: "Frontend", items: ["React 18", "TypeScript", "Vite", "Tailwind CSS", "shadcn/ui", "React Query"] },
          { category: "Backend", items: ["Supabase", "PostgreSQL", "pgvector"] },
          { category: "AI/ML", items: ["Google Gemini API", "RAG System", "Vector Embeddings"] },
          { category: "Tools", items: ["ESLint", "Prettier", "Vitest"] }
        ]
      },

      metrics: {
        title: "IMPACT METRICS",
        items: [
          "Conversion Rate: AI qualification + personalized matching",
          "Lead Quality: Improved accuracy through AI segmentation",
          "Engagement: 27k+ community testimonials → increased trust",
          "Mobile Performance: <3s FCP, PWA offline support",
          "Business Growth: Multi-tier pricing enabling reseller expansion"
        ]
      }
    },

    en: {
      title: "BP Group Product Catalog",
      subtitle: "AI-Powered Health & Business Marketplace",
      tags: ["React", "TypeScript", "Supabase", "Tailwind", "RAG AI"],

      challenge: {
        title: "CHALLENGE",
        content: `BP Group's health products have strong demand, but online sales faced obstacles:

• Buyers struggle to choose the right product—testimonials scattered across channels
• No mechanism to display healing proof RELEVANT to each individual
• Standard catalog interface cannot provide personalized recommendations
• Multi-tier pricing system (Retail/Reseller/Agent) difficult to explain
• Mobile users (majority) experience friction during browsing & checkout`
      },

      solution: {
        title: "SOLUTION",
        content: `Built e-commerce platform with "Quantum Insight Engine"—an AI system that:

🧠 Recommendation Engine (RAG-Based)
   AI Advisor understands user concerns, finds MATCHING testimonials,
   provides recommendations based on real evidence.

📱 Mobile-First Catalog
   50+ products with clear benefits, dynamic tiered pricing, gesture navigation.

🌍 Community-Powered Testimonials
   27k+ testimonials integrated from Telegram with relevance scoring.

💰 Seamless Conversion Funnel
   User journey: Browse → Ask AI → View Proof → WhatsApp Close`
      },

      features: [
        {
          icon: "✨",
          title: "AI-Powered Recommendation Engine",
          desc: "Analyzes user concerns + recommends products with proof"
        },
        {
          icon: "📱",
          title: "Mobile-First Design & PWA",
          desc: "Optimized for Indonesia market, offline support"
        },
        {
          icon: "💳",
          title: "Multi-Tier Pricing System",
          desc: "Dynamic pricing for Retail/Reseller/Agent"
        },
        {
          icon: "🌍",
          title: "Real-Time Community Insights",
          desc: "Live testimonials, geographic view, success matching"
        },
        {
          icon: "⚡",
          title: "High-Performance Data Layer",
          desc: "React Query caching, vector embeddings, resilient API"
        },
        {
          icon: "🔐",
          title: "Enterprise-Grade Security",
          desc: "Supabase RLS, rate limiting, GDPR-compliant"
        }
      ],

      role: {
        title: "OUR ROLE",
        teams: [
          {
            name: "Full-Stack Development",
            items: [
              "Frontend: React 18 + TypeScript + Tailwind CSS",
              "Custom hooks for state management",
              "Supabase integration & realtime sync",
              "Vector embeddings for RAG",
              "Vite build optimization & PWA"
            ]
          },
          {
            name: "UI/UX Design",
            items: [
              "Design system: Tailwind + shadcn/ui",
              "Mobile gesture design",
              "WCAG 2.1 accessibility",
              "Loading states & animations"
            ]
          },
          {
            name: "AI/ML Integration",
            items: [
              "RAG (Retrieval-Augmented Generation)",
              "Vector embedding pipeline",
              "Prompt engineering",
              "Context management"
            ]
          },
          {
            name: "Data Engineering",
            items: [
              "Telegram scraper & normalizer",
              "Schema design for multi-dimensional queries",
              "Vector indexing & similarity search",
              "Real-time sync"
            ]
          }
        ]
      },

      techStack: {
        title: "TECHNICAL STACK",
        stacks: [
          { category: "Frontend", items: ["React 18", "TypeScript", "Vite", "Tailwind CSS", "shadcn/ui", "React Query"] },
          { category: "Backend", items: ["Supabase", "PostgreSQL", "pgvector"] },
          { category: "AI/ML", items: ["Google Gemini API", "RAG System", "Vector Embeddings"] },
          { category: "Tools", items: ["ESLint", "Prettier", "Vitest"] }
        ]
      },

      metrics: {
        title: "IMPACT METRICS",
        items: [
          "Conversion Rate: AI qualification + personalized matching",
          "Lead Quality: Improved accuracy through AI segmentation",
          "Engagement: 27k+ community testimonials → increased trust",
          "Mobile Performance: <3s FCP, PWA offline support",
          "Business Growth: Multi-tier pricing enabling reseller expansion"
        ]
      }
    }
  };

  const data = content[language];

  return (
    <div className="w-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white py-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <div className="inline-flex gap-2 mb-6 flex-wrap justify-center">
            {data.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 bg-blue-500/20 border border-blue-400/50 rounded-full text-sm font-mono"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">{data.title}</h1>
          <p className="text-xl text-slate-300 mb-8">{data.subtitle}</p>
        </div>

        {/* Challenge Section */}
        <section className="mb-16 bg-slate-700/30 border border-slate-600/50 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6 text-blue-400">{data.challenge.title}</h2>
          <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">
            {data.challenge.content}
          </p>
        </section>

        {/* Solution Section */}
        <section className="mb-16 bg-slate-700/30 border border-slate-600/50 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6 text-blue-400">{data.solution.title}</h2>
          <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">
            {data.solution.content}
          </p>
        </section>

        {/* Features Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-blue-400">KEY FEATURES</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-6 hover:border-blue-400/50 transition-all"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-slate-300 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Our Role Section */}
        <section className="mb-16 bg-slate-700/30 border border-slate-600/50 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-8 text-blue-400">{data.role.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.role.teams.map((team, idx) => (
              <div key={idx}>
                <h3 className="text-lg font-bold mb-4 text-blue-300">{team.name}</h3>
                <ul className="space-y-2 text-slate-200">
                  {team.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex gap-3">
                      <span className="text-blue-400 flex-shrink-0">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="mb-16 bg-slate-700/30 border border-slate-600/50 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-8 text-blue-400">{data.techStack.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.techStack.stacks.map((stack, idx) => (
              <div key={idx}>
                <h3 className="font-bold text-blue-300 mb-3">{stack.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {stack.items.map((item, itemIdx) => (
                    <span
                      key={itemIdx}
                      className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded text-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Metrics Section */}
        <section className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-400/30 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-8 text-center text-blue-400">{data.metrics.title}</h2>
          <ul className="space-y-3 text-slate-200">
            {data.metrics.items.map((item, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="text-emerald-400 flex-shrink-0">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

// Usage:
// <BPGroupPortfolio language="id" /> // untuk bahasa Indonesia
// <BPGroupPortfolio language="en" /> // untuk bahasa English

export default BPGroupPortfolio;

/*
STYLING NOTES:
- Component ini menggunakan Tailwind CSS (sesuai dengan stack project)
- Dark theme dengan aksen biru (enterprise look)
- Responsive design (mobile-first approach)
- Dapat disesuaikan dengan color scheme website Anda
- Bisa ditambahkan background image/pattern di hero section

INTEGRATION GUIDE:
1. Copy component ke file: src/components/portfolio/BPGroupPortfolio.tsx
2. Import & gunakan di portfolio page Anda
3. Customize warna & spacing sesuai brand guidelines
4. Tambahkan image/screenshot di atas section Challenge
5. Add CTA button di bawah metrics section

HERO IMAGE PLACEMENT SUGGESTION:
const heroImage = (
  <div className="mb-16 rounded-lg overflow-hidden border border-slate-600/50">
    <img 
      src="/images/bp-group-portfolio-hero.webp" 
      alt="BP Group Product Catalog Dashboard"
      className="w-full h-auto object-cover"
    />
  </div>
);
*/
