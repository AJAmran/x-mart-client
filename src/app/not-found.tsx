import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-center">
      <h2 className="text-4xl font-bold text-gray-800 mb-4">404</h2>
      <p className="text-lg text-gray-600 mb-6">The page you are looking for could not be found.</p>
      <Link
        href="/"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
      >
        Return to Homepage
      </Link>
    </div>
  );
}
