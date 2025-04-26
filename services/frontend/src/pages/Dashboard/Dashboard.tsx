import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="bg-gray-50 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Link
          to="/shop"
          className="block bg-white shadow-md rounded-lg p-6 text-center border hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold text-blue-600">Shop</h2>
          <p className="text-gray-600 mt-2">View shop.</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
