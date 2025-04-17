import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-blue-600 text-center mb-6">Welcome to Service Hub</h1>
      <p className="text-gray-700 text-lg text-center mb-6">
        Your centralized platform for managing services, connecting APIs, and powering modern
        commerce.
      </p>

      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-500">Modular Architecture</h2>
          <p className="text-gray-600">
            Service Hub is built with a microservices-first approach. Each service—such as auth,
            shop, and user management—is fully decoupled and independently deployable.
          </p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-500">Shop Service</h2>
          <p className="text-gray-600">
            Our Shop Service lets users browse products, manage their carts, and perform secure
            checkouts. It integrates seamlessly with Auth and Payment services for a smooth
            experience.
          </p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-500">Secure & Scalable</h2>
          <p className="text-gray-600">
            Backed by robust authentication, real-time health checks, and environment-based configs,
            the platform is designed for both reliability and rapid scaling.
          </p>
        </div>
      </div>

      <div className="text-center mt-6">
        <Link
          to="/auth/login"
          className="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default Home;
