import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import BannerCarousel from '../components/Banner';
import CategorySection from '../components/Category';
import ProductCard from '../components/ui/ProductCard';
import api from '../api/axios';

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") ?? "";

  const [searchResults, setSearchResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [topDeals, setTopDeals] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [trending, setTrending] = useState([]);
  const [hot, setHot] = useState([]);
  const [limited, setLimited] = useState([]);

  useEffect(() => {
    const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const averageRating = searchParams.get("averageRating") || "";
  const sort = searchParams.get("sort") || "";
  const search = searchParams.get("search") || "";

  const query = new URLSearchParams();
  if (search) query.append("search", search);
  if (minPrice) query.append("minPrice", minPrice);
  if (maxPrice) query.append("maxPrice", maxPrice);
  if (averageRating) query.append("averageRating", averageRating);
  if (sort) query.append("sort", sort);

  const finalQueryString = query.toString()

  if (search || minPrice || maxPrice || averageRating || sort) {
    api.get(`/products?${finalQueryString}`)
      .then(res => setSearchResults(res.data))
      .catch(console.error);
    return;
  }


    // Default sections
    api.get('/products')
      .then(res => {
        const products = res.data;
        setAllProducts(products);

        const deals = [...products]
          .sort((a, b) => (b.discount || 0) - (a.discount || 0))
          .slice(0, 10);
        setTopDeals(deals);

        const arrivals = [...products]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 10);
        setNewArrivals(arrivals);

        const feat = products
          .filter(p => p.isFeatured || p.tags?.includes('Featured'))
          .slice(0, 8);
        setFeatured(feat);

        setTrending(products.filter(p => p.tags?.includes('Trending')));
        setHot(products.filter(p => p.tags?.includes('Hot')));
        setLimited(products.filter(p => p.tags?.includes('Limited Edition')));
      })
      .catch(console.error);

    const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    if (viewed.length) {
      api.post('/products/batch', { ids: viewed })
        .then(res => setRecentlyViewed(res.data))
        .catch(console.error);
    }
  }, [searchParams]);

  // If in search mode, show only search results
 if (searchQuery) {
  return (
    <div className="space-y-12 p-4 relative z-10"> {/* Adjust relative positioning and z-index */}
      <h2 className="text-2xl font-bold mb-4">
        Search results for "{searchQuery}"
      </h2>
      {searchResults.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {searchResults.map(prod => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No products found.</p>
      )}
    </div>
  );
}

  // Default homepage layout
  return (
    <div className="space-y-12">
      {/* Banner + Categories */}
      <section className="py-4">
        <div className="px-4 mb-4">
          <h2 className="text-2xl font-bold mb-4">Shop by Category</h2>
          <CategorySection />
        </div>
        <div className="px-4">
          <BannerCarousel />
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="py-8">
          <h2 className="text-2xl font-bold mb-4 px-4">Featured Products</h2>
          <div className="overflow-x-auto px-4 space-x-4 flex">
            {featured.map(prod => (
              <div key={prod._id} className="flex-shrink-0 w-64">
                <ProductCard product={prod} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Top Deals */}
      {topDeals.length > 0 && (
        <section className="py-8">
          <h2 className="text-2xl font-bold mb-4 px-4">Top Deals</h2>
          <div className="overflow-x-auto px-4 space-x-4 flex">
            {topDeals.map(prod => (
              <div key={prod._id} className="flex-shrink-0 w-64">
                <ProductCard product={prod} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-8">
          <h2 className="text-2xl font-bold mb-4 px-4">New Arrivals</h2>
          <div className="overflow-x-auto px-4 space-x-4 flex">
            {newArrivals.map(prod => (
              <div key={prod._id} className="flex-shrink-0 w-64">
                <ProductCard product={prod} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Trending, Hot, Limited Editions, Recently Viewed */}
      {[
        { title: 'Trending Products', items: trending },
        { title: 'Hot Products', items: hot },
        { title: 'Limited Editions', items: limited },
        { title: 'Recently Viewed', items: recentlyViewed }
      ].map(({ title, items }) =>
        items.length > 0 ? (
          <section key={title} className="py-8">
            <h2 className="text-2xl font-bold mb-4 px-4">{title}</h2>
            <div className="overflow-x-auto px-4 space-x-4 flex">
              {items.map(prod => (
                <div key={prod._id} className="flex-shrink-0 w-64">
                  <ProductCard product={prod} />
                </div>
              ))}
            </div>
          </section>
        ) : null
      )}

      {/* All Products Grid */}
      <section className="py-8">
        <h2 className="text-2xl font-bold mb-4 px-4">All Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-4">
          {allProducts.map(prod => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
