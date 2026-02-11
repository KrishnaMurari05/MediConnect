import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HealthWise Connect | Smart Health Assessments',
  description: 'Empowering you to take control of your health through AI-driven insights and professional consultations.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-body antialiased selection:bg-primary/20">
        {children}
      </body>
    </html>
  );
}