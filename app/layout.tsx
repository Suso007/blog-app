import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: '--font-sans',
  display: 'swap',
});

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
    <html lang="en">
      <body className={`${playfair.variable} ${dmSans.variable} font-sans antialiased`}>

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
