'use client';
import '../styles/globals.css'; // Global styles

import { ThemeProvider } from '@material-tailwind/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <Navbar />
      <main className="container mx-auto p-4">{children}</main>
      <Footer />
    </ThemeProvider>
  );
}
