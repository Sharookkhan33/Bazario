import React from "react";
import { Link } from "react-router-dom";

const promoImages = [
  "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://media.istockphoto.com/id/1444802210/photo/business-handshake-businessman-man-office-meeting-agreement-hand-teamwork-contract-greeting.webp?a=1&b=1&s=612x612&w=0&k=20&c=ZUtuzr8FwWFRE4CwPuAUbTtNuAv2Iyf5H0VjdRKmS3I=",
  "https://plus.unsplash.com/premium_photo-1682141858141-fe64a6d7c04f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fFF1YWxpdHklMjBhbmQlMjBzZXJ2aWNlfGVufDB8fDB8fHww",
];

const promoQuotes = [
  "Your journey starts here",
  "Buy from trusted vendors",
  "Unmatched quality & service",
];

export default function LandingPage() {
  return (
    <div className="font-sans text-gray-800">
      {/* Hero Section */}
      <section
        className="bg-cover bg-center text-white py-28 text-center px-4 relative"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.pexels.com/photos/7857526/pexels-photo-7857526.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
        }}
      >
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-shadow">
          Welcome to <span className="text-yellow-300">Bazario</span>
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-white/90">
          Bazario is your go-to destination to discover quality products, trusted vendors, and seamless shopping – all in one powerful marketplace.
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <Link
            to="/login"
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-3 rounded-lg transition duration-300 shadow-md"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-6 py-3 rounded-lg transition duration-300 shadow-md"
          >
            Register
          </Link>
          <Link
            to="/home"
            className="bg-white/90 hover:bg-white text-black font-bold px-6 py-3 rounded-lg transition duration-300 shadow-md"
          >
            Enter Website
          </Link>
        </div>
      </section>

      {/* Promo Section */}
      <section className="grid md:grid-cols-3 gap-6 p-8 bg-gray-50">
        {promoQuotes.map((quote, idx) => (
          <div
            key={idx}
            className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300"
          >
            <img
              src={promoImages[idx]}
              alt="Promo"
              className="w-full h-64 object-cover"
            />
            <div className="absolute bottom-0 bg-black/60 text-white p-4 w-full text-center text-lg font-semibold">
              “{quote}”
            </div>
          </div>
        ))}
      </section>
      {/* Reviews Section */}
      <section
        className="bg-cover bg-fixed bg-center py-16 px-6 text-center text-white"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.pexels.com/photos/13443801/pexels-photo-13443801.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
        }}
      >
        <h2 className="text-3xl font-bold mb-8">What Our Users Say</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "Alice M.", text: "Absolutely love the variety!", rating: 4 },
            { name: "Rahul S.", text: "Fast delivery and great support!", rating: 5 },
            { name: "Linda G.", text: "Selling here boosted my income!", rating: 5 },
          ].map((review, i) => (
            <div key={i} className="bg-white/80 text-black rounded shadow-md p-6">
              <p className="italic mb-2">“{review.text}”</p>
              <div className="text-yellow-500 text-lg">
                {"⭐".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
              </div>
              <div className="font-semibold mt-2 text-blue-800">– {review.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section
        className="py-14 px-8 text-center bg-[url('https://images.pexels.com/photos/7667442/pexels-photo-7667442.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-fixed bg-center text-white"
        style={{ backgroundBlendMode: "overlay", backgroundColor: "rgba(0,0,0,0.7)" }}
      >
        <h2 className="text-3xl font-bold mb-4">About Bazario</h2>
        <p className="max-w-3xl mx-auto text-lg">
          Bazario is a modern multi-vendor platform where buyers meet sellers in a secure, smart, and scalable ecosystem. From essentials to exclusive deals – we’ve got you covered.
        </p>
      </section>

      {/* Services Section */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-100 py-14 px-6 text-center">
        <h2 className="text-2xl font-bold mb-8 text-blue-900">Our Services</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "🔒 Secure Payments", desc: "Safe and fast transactions every time." },
            { title: "✅ Verified Sellers", desc: "Buy from trusted and verified vendors." },
            { title: "🕐 24/7 Support", desc: "We’re here to help, anytime you need." }
          ].map((service, i) => (
            <div key={i} className="bg-white p-6 rounded shadow-md hover:shadow-xl transition duration-300">
              <h3 className="text-xl font-bold text-purple-700">{service.title}</h3>
              <p className="text-gray-600 mt-2">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Become a Seller */}
      <section
        className="py-16 px-8 bg-gradient-to-r from-green-500 to-green-700 text-white text-center"
        style={{ backgroundImage: "url('https://images.pexels.com/photos/6169156/pexels-photo-6169156.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')", backgroundBlendMode: "multiply", backgroundSize: "cover" }}
      >
        <h2 className="text-3xl font-bold mb-4">Become a Seller on Bazario</h2>
        <p className="max-w-2xl mx-auto mb-6 text-lg">
          Join our vibrant seller community and unlock the full potential of your online store. Manage products, track orders, and build your brand.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <div className="bg-white/20 p-4 rounded-lg">
            <h3 className="text-xl font-semibold">📦 Easy Product Upload</h3>
            <p>Manage listings with ease.</p>
          </div>
          <div className="bg-white/20 p-4 rounded-lg">
            <h3 className="text-xl font-semibold">💸 Fast Payouts</h3>
            <p>Receive your earnings quickly.</p>
          </div>
          <div className="bg-white/20 p-4 rounded-lg">
            <h3 className="text-xl font-semibold">📈 Grow Your Reach</h3>
            <p>Tap into our massive customer base.</p>
          </div>
        </div>
        <Link
          to="/vendor-home
          "
          className="mt-8 inline-block bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold px-8 py-3 rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition"
        >
          Become a Seller
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-700 bg-gray-200">
        &copy; {new Date().getFullYear()} <span className="font-semibold text-blue-700">Bazario</span> — All rights reserved.
      </footer>
    </div>
  );
}
