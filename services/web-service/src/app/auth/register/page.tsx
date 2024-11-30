'use client';

import { useState } from 'react';
import { Card, Typography, Input, Button } from '@material-tailwind/react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // const formData = new FormData(event.currentTarget);

    // const name = formData.get('name') as string;
    // const email = formData.get('email') as string;
    // const password = formData.get('password') as string;

    try {
      setLoading(true);
      setError(null);

      console.log('User registered successfully');

      // Redirect to login
      router.push('/auth/login');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-sm p-6">
        <Typography variant="h4" color="blue-gray" className="text-center mb-6">
          Register
        </Typography>
        <form
          onSubmit={handleSubmit}
          className="w-full space-y-4" // Ensure the form width matches the card
        >
          {/* Name Input */}
          <div className="w-full">
            <Input
              name="name"
              type="text"
              label="Name"
              size="lg"
              required
              crossOrigin={undefined}
              className="w-full" // Match the input width to the form
            />
          </div>
          {/* Email Input */}
          <div className="w-full">
            <Input
              name="email"
              type="email"
              label="Email"
              size="lg"
              required
              crossOrigin={undefined}
              className="w-full"
            />
          </div>
          {/* Password Input */}
          <div className="w-full">
            <Input
              name="password"
              type="password"
              label="Password"
              size="lg"
              required
              crossOrigin={undefined}
              className="w-full"
            />
          </div>
          {/* Error Message */}
          {error && (
            <Typography variant="small" color="red" className="text-center">
              {error}
            </Typography>
          )}
          {/* Submit Button */}
          {/* <div className="w-full"> */}
          <Button size="lg" color="blue" fullWidth type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </Button>
          {/* </div> */}
        </form>
        {/* Redirect to Login */}
        <Typography variant="small" className="text-center mt-4 text-gray-600">
          Already have an account?{' '}
          <a href="/auth/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </Typography>
      </Card>
    </div>
  );
}
