/**
 * Single source of truth for identity, links, and site-wide constants.
 */
export const site = {
  name: "Imtiaz Hossain",
  shortName: "IH",
  role: "AI Engineer & Researcher",
  tagline: "I build intelligent systems.",
  description:
    "AI Engineer and researcher working across computer vision, NLP, deep learning, and production systems. BRAC University, Dhaka.",
  location: "Dhaka, Bangladesh",
  email: "imtiaz.hossain.eshan@gmail.com",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://imtiazhossain.dev",
  githubUsername: "ImtiazHossain-Eshan",
  links: {
    github: "https://github.com/ImtiazHossain-Eshan",
    linkedin: "https://www.linkedin.com/in/imtiazhossaineshan/",
    scholar: "https://scholar.google.com/citations?user=CIjeZSsAAAAJ&hl=en",
    leetcode: "https://leetcode.com/u/Imtiaz_Hossain_Eshan/",
  },
  university: "BRAC University",
  cgpa: "3.7+",
} as const;

export const navLinks = [
  { href: "/projects", label: "Work" },
  { href: "/playground", label: "Playground" },
  { href: "/research", label: "Research" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
