'use client';

import { useState } from 'react';
import { Card, Typography, Input, Button } from '@material-tailwind/react';
// import { loginUser } from '../api';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // const formData = new FormData(event.currentTarget);

    // const email = formData.get('email') as string;
    // const password = formData.get('password') as string;

    try {
      setLoading(true);
      setError(null);
      //   const { token, user } = await loginUser(email, password);

      // Save the token in localStorage or a cookie
      //   localStorage.setItem('authToken', token);

      //   console.log('Logged in user:', user);

      // Redirect to a dashboard or home page
      router.push('/dashboard');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card shadow={true} className="w-full max-w-sm p-6">
        <Typography variant="h4" color="blue-gray" className="text-center mb-6">
          Login
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="email"
            type="email"
            label="Email"
            size="lg"
            required
            crossOrigin={undefined}
          />
          <Input
            name="password"
            type="password"
            label="Password"
            size="lg"
            required
            crossOrigin={undefined}
          />
          {error && (
            <Typography variant="small" color="red" className="text-center">
              {error}
            </Typography>
          )}
          <Button type="submit" color="blue" fullWidth disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <Typography variant="small" className="text-center mt-4 text-gray-600">
          Don’t have an account?{' '}
          <a href="/auth/register" className="text-blue-500 hover:underline">
            Register
          </a>
        </Typography>
      </Card>
    </div>
  );
}
