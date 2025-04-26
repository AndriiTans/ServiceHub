import { Outlet, Link } from 'react-router-dom';
import './index.css';

const NonAuthLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-500 to-blue-700 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">My App</h1>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link to="/" className="text-white hover:text-blue-200 transition duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/auth/register"
                  className="text-white hover:text-blue-200 transition duration-300"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  to="/auth/login"
                  className="text-white hover:text-blue-200 transition duration-300"
                >
                  Login
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto p-6">
          <Outlet />
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm">
            © 2024 My App. All rights reserved. |{' '}
            <Link to="/privacy" className="underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default NonAuthLayout;
