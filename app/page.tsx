import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#852BAF] to-[#FC3F78]">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 text-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-[#852BAF] font-bold text-lg">R</span>
          </div>
          <span className="text-xl font-bold">Rewards Platform</span>
        </div>
        <div className="space-x-4">
          <Link href="/src/login" className="px-4 py-2 rounded-lg border border-white hover:bg-white hover:text-[#852BAF] transition-colors">
            Login
          </Link>
          <Link href="/src/register" className="px-4 py-2 rounded-lg bg-white text-[#852BAF] hover:bg-gray-100 transition-colors">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20 text-center text-white">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Welcome to Rewards Platform
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          Manage your vendor products and rewards in one place
        </p>
        <div className="space-x-4">
          <Link href="/src/register" className="px-8 py-4 bg-white text-[#852BAF] rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
            Get Started
          </Link>
          <Link href="/src/login" className="px-8 py-4 border border-white text-white rounded-lg text-lg font-semibold hover:bg-white hover:text-[#852BAF] transition-colors">
            Sign In
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Platform Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#852BAF] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🏢</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Vendor Management</h3>
              <p className="text-gray-600">Manage your products and track performance</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#FC3F78] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Analytics</h3>
              <p className="text-gray-600">Track sales and customer engagement</p>
            </div>x``
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#D887FD] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🔄</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
              <p className="text-gray-600">Instant updates on approvals and sales</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}