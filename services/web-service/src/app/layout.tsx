import { Metadata } from 'next';
import ClientLayout from './ClientLayout'; // Import the ClientLayout

export const metadata: Metadata = {
  title: 'Shop Service',
  description: 'Next.js App with Authentication',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        {/* Wrap content with ClientLayout for ThemeProvider */}
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
