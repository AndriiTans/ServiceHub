import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../utils/httpClient';
import { Modal } from '../../components';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setErrorMessage(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match!');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await apiClient.post('/users/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        authMethod: 'local',
      });

      console.log('response ', response);

      setIsModalOpen(true);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(
          error.message || 'An error occurred during registration. Please try again.',
        );
        console.error(error);
      } else {
        setErrorMessage('An unexpected error occurred.');
        console.error('Unexpected error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Register</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2 text-left">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your name"
            className="block w-full text-gray-700 border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2 text-left">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            className="block w-full text-gray-700 border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2 text-left">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            className="block w-full text-gray-700 border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-gray-700 font-medium mb-2 text-left"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm your password"
            className="block w-full text-gray-700 border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </div>
      </form>

      <p className="text-center text-gray-600 mt-6">
        Already have an account?{' '}
        <Link
          to="/auth/login"
          className="text-blue-600 font-medium hover:underline hover:text-blue-800 transition"
        >
          Login here
        </Link>
      </p>
      <Modal
        isOpen={isModalOpen}
        title="Congrats!"
        content={<p>Registration successful! You can now log in.</p>}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          setIsModalOpen(false);
          navigate('/auth/login');
        }}
        confirmLabel="Go to Login"
        cancelLabel="Close"
      />
    </div>
  );
};

export default Register;
