import React from "react";
import { Link } from "react-router-dom";

export default function VendorLandingPage() {
    const vendorImageData = [
        {
          quote: "Turn your passion into profit",
          img: "https://images.pexels.com/photos/534229/pexels-photo-534229.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", // or use full URL like "https://example.com/image1.jpg"
        },
        {
          quote: "Reach thousands of customers daily",
          img: "https://images.pexels.com/photos/5716001/pexels-photo-5716001.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        },
        {
          quote: "Grow your brand with Bazario",
          img: "https://images.pexels.com/photos/7651924/pexels-photo-7651924.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        },
      ];
      

  const vendorTestimonials = [
    {
      name: "Priya Sharma",
      feedback: "Bazario helped me triple my monthly sales. The platform is smooth and easy to use!",
      rating: 5,
    },
    {
      name: "Ravi Patel",
      feedback: "Managing my inventory has never been easier. The dashboard is super intuitive!",
      rating: 4,
    },
    {
      name: "Nikita Jain",
      feedback: "Great exposure and excellent support from the Bazario team. Highly recommended!",
      rating: 5,
    },
  ];

  return (
    <div className="font-sans text-gray-800 bg-[url('https://images.pexels.com/photos/6995134/pexels-photo-6995134.jpeg?auto=compress&cs=tinysrgb&w=600')] bg-cover bg-center">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600/90 to-pink-600/90 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">Welcome Vendors to Bazario</h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-6 opacity-90">
          Your gateway to digital entrepreneurship. Set up shop, sell your products, and grow your brand — all in one place.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
          <Link
            to="/vendor-login"
            className="bg-white text-pink-700 font-semibold px-6 py-3 rounded-xl shadow-md hover:bg-gray-100 transition"
          >
            Vendor Login
          </Link>
          <Link
            to="/vendor-register"
            className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-xl shadow-md hover:bg-yellow-500 transition"
          >
            Register as Vendor
          </Link>
        </div>
      </section>

      {/* Quote Cards */}
      <section className="grid md:grid-cols-3 gap-6 p-8 bg-white/80 backdrop-blur-sm">
  {vendorImageData.map((item, idx) => (
    <div
      key={idx}
      className="relative overflow-hidden rounded-2xl shadow-lg group transition-transform hover:scale-105"
    >
      <img
        src={item.img}
        alt={`Vendor Inspiration ${idx + 1}`}
        className="w-full h-64 object-cover"
      />
      <div className="absolute bottom-0 bg-black/60 text-white p-4 text-center text-lg font-medium">
        “{item.quote}”
      </div>
    </div>
  ))}
</section>


      {/* Testimonials */}
      <section className="bg-gradient-to-b from-white to-purple-50 py-14 px-6 text-center">
        <h2 className="text-3xl font-bold mb-10 text-purple-700">What Our Sellers Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {vendorTestimonials.map((vendor, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <p className="italic text-gray-700 mb-3">“{vendor.feedback}”</p>
              <div className="text-lg font-semibold text-pink-600">{vendor.name}</div>
              <div className="text-yellow-400 mt-2 text-xl">
                {"★".repeat(vendor.rating)}
                {"☆".repeat(5 - vendor.rating)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Sell */}
      <section className="py-16 px-8 bg-white text-center">
        <h2 className="text-3xl font-extrabold mb-4">Why Sell on Bazario?</h2>
        <p className="max-w-2xl mx-auto text-lg text-gray-600">
          Bazario empowers vendors with tools, visibility, and support to succeed in the digital marketplace. Whether you're a small business or a large brand, we're here to fuel your growth.
        </p>
      </section>

      {/* Vendor Services */}
      <section className="bg-purple-50 py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-8 text-purple-700">Vendor Services</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Easy Product Management", desc: "Upload, edit, and track your listings with ease." },
            { title: "Real-Time Analytics", desc: "Get insights into sales, traffic, and customer behavior." },
            { title: "Dedicated Support", desc: "Our team is here 24/7 to support your growth." },
          ].map((service, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition text-left">
              <h3 className="text-xl font-bold text-purple-700">{service.title}</h3>
              <p className="text-gray-600 mt-2">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Become a Seller CTA */}
      <section className="py-20 px-8 bg-gradient-to-r from-green-400 to-green-600 text-white text-center">
        <h2 className="text-4xl font-extrabold mb-6">Start Selling on Bazario</h2>
        <p className="max-w-2xl mx-auto text-lg mb-8">
          Take control of your sales and scale your business with our platform designed specifically for modern sellers.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-6">
          <div className="bg-white/20 p-6 rounded-lg shadow-md backdrop-blur-sm">
            <h3 className="text-xl font-semibold">📦 Hassle-free Listings</h3>
            <p>List and update your products anytime from anywhere.</p>
          </div>
          <div className="bg-white/20 p-6 rounded-lg shadow-md backdrop-blur-sm">
            <h3 className="text-xl font-semibold">💰 Transparent Payouts</h3>
            <p>We ensure fast, regular, and secure payments.</p>
          </div>
          <div className="bg-white/20 p-6 rounded-lg shadow-md backdrop-blur-sm">
            <h3 className="text-xl font-semibold">📢 Marketing Tools</h3>
            <p>Promote your store with inbuilt marketing support.</p>
          </div>
        </div>
        <Link
          to="/vendor-register"
          className="mt-10 inline-block bg-white text-green-700 font-bold px-8 py-3 rounded-full shadow hover:bg-gray-100 transition"
        >
          Become a Seller
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-500 bg-white border-t">
        &copy; {new Date().getFullYear()} Bazario. Empowering Sellers Everywhere.
      </footer>
    </div>
  );
}
