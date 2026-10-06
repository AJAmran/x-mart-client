import ContactCTA from "@/src/components/about/ContactCTA";
import HeroSection from "@/src/components/about/HeroSection";
import StorySection from "@/src/components/about/StorySection";
import TeamSection from "@/src/components/about/TeamSection";
import ValuesSection from "@/src/components/about/ValuesSection";
import { Metadata } from "next";

import { siteConfig } from "@/src/config/site";

const aboutDescription = `Learn about ${siteConfig.name}, our mission to deliver quality products, our dedicated team, and the values that drive us.`;

// SEO Metadata
export const metadata: Metadata = {
  title: `About ${siteConfig.name} | Our Story, Team, and Values`,
  description: aboutDescription,
  keywords: [siteConfig.name, "about us", "e-commerce", "company story", "team", "values"],
  openGraph: {
    title: `About ${siteConfig.name}`,
    description: `Discover the story, team, and values behind ${siteConfig.name}.`,
    // Was the literal "https://your-site.com/about", which shipped as-is and
    // pointed search engines at a domain that does not belong to the buyer.
    url: `${siteConfig.url}/about`,
    images: [siteConfig.ogImage],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `About ${siteConfig.name}`,
    description: `Discover the story, team, and values behind ${siteConfig.name}.`,
    images: [siteConfig.ogImage],
  },
};

// Structured Data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: `About ${siteConfig.name}`,
  description: aboutDescription,
  publisher: {
    "@type": "Organization",
    name: siteConfig.legalName,
    logo: {
      "@type": "ImageObject",
      url: `${siteConfig.url}${siteConfig.ogImage}`,
    },
  },
};

export default async function AboutPage() {
  // Mock data (replace with API call if dynamic data is needed)
  const companyData = {
    story: [
      {
        year: 2018,
        title: `Founded ${siteConfig.name}`,
        description: "Started with a vision to revolutionize e-commerce with quality and trust.",
      },
      {
        year: 2020,
        title: "Expanded Nationwide",
        description: "Grew to serve customers across the country with fast delivery.",
      },
      {
        year: 2023,
        title: "Global Reach",
        description: "Launched international shipping and multi-language support.",
      },
      {
        year: 2025,
        title: "Sustainable Future",
        description: "Committed to eco-friendly packaging and carbon-neutral operations.",
      },
    ],
    team: [
      {
        name: "John Doe",
        role: "CEO & Founder",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgPZnsoh9tlFnoEK79W2lmMJBleVBBLFb81Q&s",
        bio: "Visionary leader with a passion for innovation.",
      },
      {
        name: "Jane Smith",
        role: "CTO",
        image: "https://img.freepik.com/free-photo/handsome-young-businessman-suit_273609-6513.jpg?semt=ais_hybrid&w=740",
        bio: "Tech enthusiast driving our platform's excellence.",
      },
      {
        name: "Alex Brown",
        role: "Head of Marketing",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-S3JwL_IAemKr2uFLHqBE0GzBlYAGVfp0kw&s",
        bio: "Creative mind behind our brand's global presence.",
      },
    ],
    values: [
      {
        title: "Quality",
        description: "We deliver only the best products to our customers.",
        icon: "Award",
      },
      {
        title: "Trust",
        description: "Building lasting relationships with transparency.",
        icon: "Shield",
      },
      {
        title: "Innovation",
        description: "Pushing boundaries with cutting-edge technology.",
        icon: "Lightbulb",
      },
      {
        title: "Sustainability",
        description: "Committed to a greener planet.",
        icon: "Leaf",
      },
    ],
  };

  return (
    <main className="min-h-screen ">
      {/* Structured Data for SEO */}
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        type="application/ld+json"
      />

      {/* Page Content */}
      <HeroSection />
      <StorySection story={companyData.story} />
      <TeamSection team={companyData.team} />
      <ValuesSection values={companyData.values} />
      <ContactCTA />
    </main>
  );
}
