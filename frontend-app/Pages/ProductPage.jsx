import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaShoppingCart, FaCreditCard, FaCheckCircle, FaTruck } from "react-icons/fa";
import "./ProductPage.css";

const ProductPage = () => {
  const { id } = useParams();
  const [mainImage, setMainImage] = useState("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const product = {
    name: "Premium Wireless Noise-Cancelling Headphones",
    brand: "Aura Audio",
    price: 299.99,
    originalPrice: 349.99,
    rating: 4.8,
    reviewsCount: 1245,
    inStock: true,
    colors: ["#1a1a1a", "#e6e6e6", "#004080"],
    [0]: { name: "Midnight Black", hex: "#1a1a1a" },
    [1]: { name: "Pearl White", hex: "#e6e6e6" },
    [2]: { name: "Ocean Blue", hex: "#004080" },
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ],
    features: [
      "Industry-leading active noise cancellation",
      "Up to 30 hours of battery life",
      "Touch sensors for music and call controls",
      "Speak-to-chat technology automatically reduces volume during conversations"
    ]
  };

  const [selectedColor, setSelectedColor] = useState(product[0]);

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
        <span>Home</span> &gt; <span>Electronics</span> &gt; <span>Audio</span> &gt; <span className="current">{product.name}</span>
      </div>

      <div className="product-main">
        {/* Left: Image Gallery */}
        <div className="product-gallery">
          <div className="main-image-wrapper">
            <img src={mainImage} alt="Product Main" className="main-image" />
          </div>
          <div className="thumbnail-list">
            {product.images.map((img, index) => (
              <div 
                key={index} 
                className={`thumbnail ${mainImage === img ? "active" : ""}`}
                onClick={() => setMainImage(img)}
              >
                <img src={img} alt={`Thumbnail ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="product-details">
          <h2 className="product-brand">{product.brand}</h2>
          <h1 className="product-title">{product.name}</h1>
          
          <div className="product-metrics">
            <div className="rating">
              <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStarHalfAlt />
              <span className="rating-value">{product.rating}</span>
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
                Save ${Math.round(product.originalPrice - product.price)}
              </span>
            )}
          </div>

          <div className="product-description-short">
            Experience premium sound quality with our state-of-the-art wireless headphones. 
            Designed for audiophiles and everyday listeners alike.
          </div>

          {/* Color Selection */}
          <div className="product-colors-section">
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
          </div>

          {/* Action Area */}
          <div className="product-actions">
            <div className="quantity-selector">
              <button onClick={() => handleQuantity("dec")}>-</button>
              <span>{quantity}</span>
              <button onClick={() => handleQuantity("inc")}>+</button>
            </div>
            
            <button className="btn-add-cart">
              <FaShoppingCart /> Add to Cart
            </button>
            
            <button className="btn-buy-now">
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
          <button 
            className={`tab-btn ${activeTab === "features" ? "active" : ""}`}
            onClick={() => setActiveTab("features")}
          >
            Key Features
          </button>
        </div>
        
        <div className="tabs-content">
          {activeTab === "description" && (
            <div className="tab-pane fade-in">
              <p>Discover the true essence of music with the Aura Audio Premium Headphones. Equipped with advanced 40mm drivers and industry-leading noise cancellation, these headphones transport you into your own world of sound. The ergonomic design ensures long-lasting comfort, while the premium materials offer durability and a sleek aesthetic. Whether you're commuting, working in a noisy office, or simply relaxing at home, Aura Audio delivers an unparalleled listening experience.</p>
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
