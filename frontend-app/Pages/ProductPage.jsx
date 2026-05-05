import React, { useState, useEffect, use } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaShoppingCart, FaCreditCard, FaCheckCircle, FaTruck } from "react-icons/fa";
const API_BASE_URL = import.meta.env.VITE_API_URL;
import "./ProductPage.css";
import { getImageUrl } from "../src/utils/imageUrl";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState([])
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  async function fetchProduct() {
    const response = await axios.get(`${API_BASE_URL}/product/${id}`)
    setProduct(response.data.product)
  }

  useEffect(() => {
    fetchProduct()
  }, [])




  async function handleOrder() {
    const items = [{ productId: product._id, quantity: quantity }]
    console.log(items)
    const res = await axios.post(`${API_BASE_URL}/placeorder/order`, {
      items: items
    }, {
      withCredentials: true
    })

    console.log(res)
    if (res.status == 201) {
      alert(`${res.data.message}`)
    }
  }

  const handleQuantity = (type) => {
    if (type === "dec" && quantity > 1) {
      setQuantity(quantity - 1);
    } else if (type === "inc" && quantity < 10) {
      setQuantity(quantity + 1);
    }
  };

  return (

    <div className="product-page-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span>Home</span> &gt; <span>Electronics</span> &gt; <span>Audio</span> &gt; <span className="current">{product.title}</span>
      </div>

      <div className="product-main">
        {/* Left: Image Gallery */}
        <div className="product-gallery">
          <div className="main-image-wrapper">
            <img
              src={getImageUrl(product?.images?.[0])}
              alt="Product Main"
              className="main-image"
            />
          </div>

        </div>

        {/* Right: Product Details */}
        <div className="product-details">
          <h1 className="product-title">{product.title}</h1>

          <div className="product-metrics">
            <div className="rating">
              <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStarHalfAlt />

            </div>
            <span className="review-count">({product.reviewsCount} reviews)</span>
            <span className="availability">
              <FaCheckCircle className="check-icon" /> In Stock
            </span>
          </div>

          <div className="product-price-section">
            <span className="current-price">${product.price}</span>
            {product.originalPrice && (
              <span className="original-price">${product.originalPrice}</span>
            )}
            {product.originalPrice && (
              <span className="discount-badge">
                {/* Save ${Math.round(product.originalPrice - product.price)} */}
              </span>
            )}
          </div>

          <div className="product-description-short">
            {product.description}
          </div>

          {/* Color Selection */}
          {/* <div className="product-colors-section">
            <h3>Color: <span className="selected-color-name">{selectedColor.name}</span></h3>
            <div className="color-options">
              {product.colors.map((colorHex, index) => (
                <div 
                  key={index}
                  className={`color-circle ${selectedColor.hex === colorHex ? "active" : ""}`}
                  style={{ backgroundColor: colorHex }}
                  onClick={() => setSelectedColor(product[index])}
                ></div>
              ))}
            </div>
          </div> */}

          {/* Action Area */}
          <div className="product-actions">
            <div className="quantity-selector">
              <button onClick={() => handleQuantity("dec")}>-</button>
              <span>{quantity}</span>
              <button onClick={() => handleQuantity("inc")}>+</button>
            </div>


            <button className="btn-buy-now" onClick={handleOrder}>
              <FaCreditCard /> Buy Now
            </button>
          </div>

          <div className="product-perks">
            <div className="perk">
              <FaTruck className="perk-icon" />
              <span>Free Delivery over $50</span>
            </div>
            <div className="perk">
              <FaCheckCircle className="perk-icon" />
              <span>1 Year Warranty</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="product-tabs-section">
        <div className="tabs-header">
          <button
            className={`tab-btn ${activeTab === "description" ? "active" : ""}`}
            onClick={() => setActiveTab("description")}
          >
            Description
          </button>

        </div>

        <div className="tabs-content">
          {activeTab === "description" && (
            <div className="tab-pane fade-in">
              <p>{product.description}</p>
            </div>
          )}
          {activeTab === "features" && (
            <div className="tab-pane fade-in">
              <ul className="feature-list">
                {product.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
