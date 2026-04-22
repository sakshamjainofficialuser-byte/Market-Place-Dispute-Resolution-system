import { useState, useEffect } from "react";
import axios from "axios";
import "./Categories.css";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
      setCategories(res.data);

      if (res.data.length > 0) {
        setSelected(res.data[0].name);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const current = categories.find((c) => c.name === selected);

  return (
    <div className="categories">
      <h2 className="categories__title">Categories</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="categories__layout">

          {/* Sidebar */}
          <div className="categories__sidebar">
            {categories.map((cat) => (
              <button
                key={cat._id || cat.name}
                className={`categories__tab ${
                  selected === cat.name ? "categories__tab--active" : ""
                }`}
                onClick={() => setSelected(cat.name)}
              >
                {cat.emoji || "📦"} {cat.name}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="categories__content">
            {current ? (
              <>
                <h3 className="categories__content-title">
                  {current.name}
                </h3>

                <div className="categories__grid">
                  {current.items?.map((item, index) => (
                    <div className="categories__item-card" key={index}>
                      {item}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p>No Data</p>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
