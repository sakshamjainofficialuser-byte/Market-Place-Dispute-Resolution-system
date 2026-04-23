import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Homepage.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function Homepage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/homepage/users`);
      console.log(res.data)
      setProducts(res.data.products);
    } catch (err) {
      console.log("err:::", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="homepage">
      <h1 className="homepage__title">Products</h1>

      <div className="homepage__grid">
        {loading ? (
          <p>Loading...</p>
        ) : products.length === 0 ? (
          <p>No Products Found</p>
        ) : (
          products.map((item) => (
            <div
              className="homepage__card"
              key={item._id}
              onClick={() => navigate(`/product/${item._id}`)}
              style={{ cursor: "pointer" }}
            >

              {/* Image */}
              <img
                src={item.images[0]}
                alt={item.title}
                className="homepage__image"
              />

              {/* Info */}
              <h3 className="homepage__name">{item.title}</h3>
              <p className="homepage__price">
                ₹{item.price?.toLocaleString()}
              </p>

            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Homepage;