import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function WishlistSection() {
  const [list, setList] = useState([]);
  useEffect(() => {
    api.get("/wishlist/", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then(res => setList(res.data.products));
  }, []);

  return (
    <div>
      <h2 className="text-xl mb-4">My Wishlist</h2>
      {list.length === 0
        ? <p>Your wishlist is empty.</p>
        : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {list.map(p => (
              <div key={p._id} className="bg-white p-3 rounded shadow">
                <img src={p.image} alt={p.name} className="h-32 w-full object-cover mb-2" />
                <p className="text-sm">{p.name}</p>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}
