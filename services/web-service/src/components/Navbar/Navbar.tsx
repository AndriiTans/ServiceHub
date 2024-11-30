'use client';

import { useState } from 'react';
import { Navbar, Button, IconButton, Collapse } from '@material-tailwind/react';
import Link from 'next/link';

export default function MaterialNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Navbar className="mx-auto max-w-screen-lg px-4 py-2 bg-white shadow-md">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-lg font-bold text-blue-500">
          Shop Service
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-4">
          <Link href="/auth/login">
            <Button variant="text" color="blue">
              Login
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button variant="gradient" color="blue">
              Register
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <IconButton
          variant="text"
          color="blue-gray"
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden"
        >
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          )}
        </IconButton>
      </div>

      {/* Mobile Navigation */}
      <Collapse open={isOpen} className="md:hidden">
        <div className="flex flex-col gap-2 mt-2">
          <Link href="/auth/login">
            <Button variant="text" color="blue" fullWidth>
              Login
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button variant="gradient" color="blue" fullWidth>
              Register
            </Button>
          </Link>
        </div>
      </Collapse>
    </Navbar>
  );
}
