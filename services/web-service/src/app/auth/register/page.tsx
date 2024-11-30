'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/lib/api/auth'; // Import the registerUser function
import { Button, Input, Typography, Card } from '@material-tailwind/react';

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      setLoading(true);
      setError(null);

      // Call the API to register the user
      await registerUser(name, email, password);

      console.log('User registered successfully');
      router.push('/auth/login'); // Redirect to login page
    } catch (err) {
      setError((err as Error).message); // Display the error message
    } finally {
      setLoading(false);
    }
  };
  console.log('process.env ', process.env);
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6">
      <Card className="w-full max-w-sm p-6">
        <Typography variant="h4" color="blue-gray" className="text-center mb-6">
          Register
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="name" type="text" label="Name" size="lg" required crossOrigin={undefined} />
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
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>
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
