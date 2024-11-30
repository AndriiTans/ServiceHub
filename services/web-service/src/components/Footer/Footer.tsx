'use client';

import { Typography } from '@material-tailwind/react';

export default function Footer() {
  return (
    <footer className="bg-gray-200 py-6">
      <div className="container mx-auto text-center">
        {/* Footer Text */}
        <Typography variant="small" color="gray" className="mb-2">
          &copy; 2024 <span className="font-semibold">Shop Service</span>. All rights reserved.
        </Typography>
        {/* Links */}
        <div className="flex justify-center space-x-4">
          <Typography as="a" href="/about" variant="small" color="blue" className="hover:underline">
            About Us
          </Typography>
          <Typography
            as="a"
            href="/privacy"
            variant="small"
            color="blue"
            className="hover:underline"
          >
            Privacy Policy
          </Typography>
          <Typography
            as="a"
            href="/contact"
            variant="small"
            color="blue"
            className="hover:underline"
          >
            Contact
          </Typography>
        </div>
      </div>
    </footer>
  );
}
