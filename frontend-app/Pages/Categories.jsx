import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Categories.css";
import { getImageUrl } from "../src/utils/imageUrl";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Now calls the real backend endpoint
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/categories`);
      setCategories(res.data.categories || []);
      if (res.data.categories && res.data.categories.length > 0) {
        setSelected(res.data.categories[0].name);
      }
    } catch (err) {
      console.log("Categories fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const current = categories.find((c) => c.name === selected);

  // Category emoji mapping
  const categoryEmoji = {
    Electronics: "💻",
    Clothing: "👗",
    Books: "📚",
    "Home & Kitchen": "🏠",
    Sports: "⚽",
    Beauty: "💄",
    Toys: "🧸",
    Automotive: "🚗",
    Grocery: "🛒",
  };

  return (
    <div className="categories">
      <h2 className="categories__title">Browse Categories</h2>

      {loading ? (
        <p style={{ color: "white", padding: "20px" }}>Loading categories...</p>
      ) : categories.length === 0 ? (
        <p style={{ color: "white", padding: "20px" }}>No categories found.</p>
      ) : (
        <div className="categories__layout">
          {/* Sidebar */}
          <div className="categories__sidebar">
            {categories.map((cat) => (
              <button
                key={cat.name}
                className={`categories__tab ${selected === cat.name ? "categories__tab--active" : ""}`}
                onClick={() => setSelected(cat.name)}
              >
                {categoryEmoji[cat.name] || "📦"} {cat.name}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="categories__content">
            {current ? (
              <>
                <h3 className="categories__content-title">
                  {categoryEmoji[current.name] || "📦"} {current.name}
                  <span style={{ fontSize: "14px", fontWeight: 400, marginLeft: "10px", opacity: 0.7 }}>
                    ({current.products?.length || 0} products)
                  </span>
                </h3>

                {current.products?.length === 0 ? (
                  <p style={{ opacity: 0.6 }}>No products in this category yet.</p>
                ) : (
                  <div className="categories__grid">
                    {current.products?.map((product) => (
                      <div
                        className="categories__item-card"
                        key={product._id}
                        onClick={() => navigate(`/product/${product._id}`)}
                        style={{ cursor: "pointer" }}
                      >
                        {product.images?.[0] ? (
                          <img
                            src={getImageUrl(product.images[0])}
                            alt={product.title}
                            style={{
                              width: "100%",
                              height: "120px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              marginBottom: "8px",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "120px",
                              background: "rgba(255,255,255,0.1)",
                              borderRadius: "8px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "40px",
                              marginBottom: "8px",
                            }}
                          >
                            {categoryEmoji[current.name] || "📦"}
                          </div>
                        )}
                        <p style={{ fontWeight: 600, fontSize: "14px" }}>{product.title}</p>
                        <p style={{ color: "#6366f1", fontWeight: 700, marginTop: "4px" }}>
                          ₹{product.price?.toLocaleString()}
                        </p>
                        <span
                          style={{
                            fontSize: "11px",
                            background: product.fulfillmentType === "FBA" ? "#22c55e22" : "#f59e0b22",
                            color: product.fulfillmentType === "FBA" ? "#22c55e" : "#f59e0b",
                            padding: "2px 6px",
                            borderRadius: "4px",
                          }}
                        >
                          {product.fulfillmentType}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p>Select a category to view products.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
