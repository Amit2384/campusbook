import Link from "next/link";
import { BookOpen, Search, ShieldCheck, Repeat } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Buy, Sell, and Rent <br /> <span className="text-primary-200">Campus Books</span> Easily
          </h1>
          <p className="text-lg md:text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join the smartest network of students saving money on textbooks every semester. Affordable, sustainable, and right on your campus.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/browse" className="bg-white text-primary-700 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition shadow-lg">
              Browse Books
            </Link>
            <Link href="/register" className="bg-transparent border border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-white/10 transition">
              Join Now
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">How CampusBook Works</h2>
        <div className="grid md:grid-cols-3 gap-12">
          
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-primary-600">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Find Your Textbook</h3>
            <p className="text-gray-600">Search effectively by title, author, or subject. Filter by condition and price.</p>
          </div>

          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-primary-600">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Secure Transactions</h3>
            <p className="text-gray-600">Place orders with confidence. Verified accounts, rated sellers, and secure payments.</p>
          </div>

          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-primary-600">
              <Repeat className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Rent & Return</h3>
            <p className="text-gray-600">Don't want to buy? Rent your books for the semester and return them on time.</p>
          </div>

        </div>
      </section>
    </div>
  );
}
