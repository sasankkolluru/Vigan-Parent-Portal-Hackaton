export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Vignan's University Parent Portal
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Complete Student Management System
          </p>
          <div className="space-x-4">
            <a 
              href="/login" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Student Login
            </a>
            <a 
              href="/admin/login" 
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
              Admin Login
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
