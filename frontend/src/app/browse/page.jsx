"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { Search, Filter, ShoppingCart, BookOpen } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function BrowseBooks() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    category_id: "",
    condition_state: "",
    type: "", // Sale or Rent
    sort: "created_at",
    order: "DESC",
    page: 1
  });
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/books/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams(
        Object.entries(filters).filter(([_, v]) => v !== "")
      ).toString();
      
      const res = await api.get(`/books?${query}`);
      setBooks(res.data.books);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 space-y-6">
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-bold flex items-center gap-2 mb-4 text-gray-900">
              <Filter className="w-5 h-5" /> Filters
            </h3>
            
            <div className="space-y-4">
              {/* Category */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Category</label>
                <select 
                  name="category_id" 
                  value={filters.category_id} 
                  onChange={handleChange}
                  className="w-full border-gray-300 rounded-lg text-sm p-2 bg-gray-50 border"
                >
                  <option value="">All Categories</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Condition */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Condition</label>
                <select 
                  name="condition_state" 
                  value={filters.condition_state} 
                  onChange={handleChange}
                  className="w-full border-gray-300 rounded-lg text-sm p-2 bg-gray-50 border"
                >
                  <option value="">Any Condition</option>
                  <option value="New">New</option>
                  <option value="Good">Good</option>
                  <option value="Acceptable">Acceptable</option>
                </select>
              </div>

              {/* Type */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Sale or Rent</label>
                <select 
                  name="type" 
                  value={filters.type} 
                  onChange={handleChange}
                  className="w-full border-gray-300 rounded-lg text-sm p-2 bg-gray-50 border"
                >
                  <option value="">Both</option>
                  <option value="Sale">For Sale</option>
                  <option value="Rent">For Rent</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Sort By</label>
                <select 
                  name="sort" 
                  value={filters.sort} 
                  onChange={handleChange}
                  className="w-full border-gray-300 rounded-lg text-sm p-2 bg-gray-50 border"
                >
                  <option value="created_at">Newest First</option>
                  <option value="price">Price</option>
                </select>
              </div>

            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Search Bar */}
          <div className="mb-8 relative">
            <input
              type="text"
              name="search"
              placeholder="Search by title or author..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              value={filters.search}
              onChange={handleChange}
            />
            <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
          </div>

          {/* Book Grid */}
          {loading ? (
            <div className="text-center py-20 text-gray-500">Loading books...</div>
          ) : books.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              No books found matching your criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map(book => (
                <Link key={book.id} href={`/book/${book.id}`} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition flex flex-col group block">
                  {book.image_url ? (
                    <img src={`http://localhost:5000${book.image_url}`} alt={book.title} className="w-full h-48 object-cover bg-gray-50" />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="text-xs font-semibold text-primary-600 mb-1">{book.category_name}</div>
                    <h3 className="font-bold text-lg text-gray-900 leading-tight mb-1 line-clamp-2">{book.title}</h3>
                    <p className="text-sm text-gray-500 mb-4">{book.author}</p>
                    
                    <div className="flex items-end justify-between mt-auto">
                      <div>
                        {book.price && <div className="font-bold text-gray-900">₹{book.price}</div>}
                        {book.rental_price_per_day && <div className="text-xs text-gray-500">₹{book.rental_price_per_day}/day rent</div>}
                      </div>
                      <div className="bg-primary-50 text-primary-700 p-2 rounded-lg group-hover:bg-primary-100 transition">
                        <ShoppingCart className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                <button
                  key={num}
                  onClick={() => handlePageChange(num)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    filters.page === num 
                      ? "bg-primary-600 text-white" 
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
