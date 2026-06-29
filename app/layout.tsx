import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";
import { cn } from "@/lib/utils";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: '--font-display',
  display: 'swap',
});

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Susovan's Blog - Musings of a Software Engineer",
  description: "Musings of a Software Engineer",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={`${playfair.variable} ${geist.variable} font-sans antialiased`}>

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >{children}</ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
