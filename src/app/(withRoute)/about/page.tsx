import ContactCTA from "@/src/components/about/ContactCTA";
import HeroSection from "@/src/components/about/HeroSection";
import StorySection from "@/src/components/about/StorySection";
import TeamSection from "@/src/components/about/TeamSection";
import ValuesSection from "@/src/components/about/ValuesSection";
import { Metadata } from "next";


// SEO Metadata
export const metadata: Metadata = {
  title: "About X-mart | Our Story, Team, and Values",
  description:
    "Learn about X-mart, our mission to deliver quality products, our dedicated team, and the values that drive us.",
  keywords: ["X-mart", "about us", "e-commerce", "company story", "team", "values"],
  openGraph: {
    title: "About X-mart",
    description: "Discover the story, team, and values behind X-mart.",
    url: "https://your-site.com/about",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About X-mart",
    description: "Discover the story, team, and values behind X-mart.",
    images: ["/og-image.jpg"],
  },
};

// Structured Data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About X-mart",
  description:
    "Learn about X-mart, our mission to deliver quality products, our dedicated team, and the values that drive us.",
  publisher: {
    "@type": "Organization",
    name: "X-mart",
    logo: {
      "@type": "ImageObject",
      url: "/logo.png",
    },
  },
};

export default async function AboutPage() {
  // Mock data (replace with API call if dynamic data is needed)
  const companyData = {
    story: [
      {
        year: 2018,
        title: "Founded X-mart",
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
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
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