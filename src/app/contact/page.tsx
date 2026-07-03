import type { Metadata } from "next";
import { ContactExperience } from "@/components/contact/contact-experience";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Imtiaz Hossain about research collaboration, AI and ML engineering roles, or graduate opportunities.",
};

export default function ContactPage() {
  return <ContactExperience />;
}
