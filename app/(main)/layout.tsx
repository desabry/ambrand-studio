import type { Metadata } from "next";
import "@/css/styles.css";
import "@/css/portfolite-works.css";
import "@/css/project-gallery.css";
import "@/css/text-letter-filler.css";
import "@/css/blur-text.css";

export const metadata: Metadata = {
  title: "Ambrand Studio - We Create WOW",
  description: "Professional branding and design studio specializing in brand identity, logo design, packaging, motion graphics, and web design.",
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Stara:wght@300;400;600;700&family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&display=swap"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
      <link rel="icon" type="image/png" href="/images/site-icon.png" />
      {children}
    </>
  );
}
