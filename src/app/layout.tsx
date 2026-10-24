import type { Metadata } from "next";
import { Amiri, IBM_Plex_Sans_Arabic, Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import { WixVisualEditor } from "@/components/WixVisualEditor";
import "./globals.css";

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  display: "swap",
});

const ibmArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-arabic",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "مِنْهَاجُ الفَقِير | الأكاديمية التكوينية والتأصيلية لسالكي الطريقة القادرية البودشيشية",
  description: "منهاج تعليمي وسلوكي متدرج لفقراء الطريقة القادرية البودشيشية يجمع بين التأصيل الشرعي لممارسات الطريق (السبحة، الذكر جهراً، العمارة)، فقه الأوراد والوظيفة، الأربعين النووية بمساق سلوكي، وتلاخيص أمهات كتب التصوف مع كبسولات الحكم العطائية اليومية.",
  keywords: [
    "منهاج الفقير",
    "الطريقة القادرية البودشيشية",
    "تكوين الفقير",
    "التأصيل الشرعي للتصوف",
    "تأصيل السبحة",
    "الذكر جهرا",
    "العمارة والسماع",
    "الورد والوظيفة",
    "الأربعين النووية",
    "الحكم العطائية"
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${amiri.variable} ${ibmArabic.variable} ${cormorant.variable} ${jakarta.variable} scroll-smooth`}
    >
      <body className="min-h-screen bg-[#FAF7F2] text-[#1D2A24] dark:bg-[#0B1914] dark:text-[#E8F0EC] font-sans antialiased selection:bg-[#C5A059]/25 selection:text-[#1B4332] dark:selection:text-[#E5C378]">
        {children}
        <WixVisualEditor />
      </body>
    </html>
  );
}
