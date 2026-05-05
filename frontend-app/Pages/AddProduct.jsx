import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddProduct.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    fulfillmentType: "FBM",
    category: ""
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    // Create preview URLs for the selected images
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });
    selectedFiles.forEach(file => {
      submitData.append("images", file);
    });

    try {
      await axios.post(`${API_BASE_URL}/products/add`, submitData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Product added successfully!");
      navigate("/seller");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-page">
      <div className="add-product-header">
        <h1>Add New Product</h1>
        <p>List a new item in your store</p>
      </div>

      <form className="add-product-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Wireless Noise-Cancelling Headphones"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your product..."
            rows={4}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="1"
              placeholder="e.g. 2999"
              required
            />
          </div>
          <div className="form-group">
            <label>Stock Quantity</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              placeholder="e.g. 50"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g. Electronics"
              required
            />
          </div>
          <div className="form-group">
            <label>Fulfillment Type</label>
            <select
              name="fulfillmentType"
              value={formData.fulfillmentType}
              onChange={handleChange}
              required
            >
              <option value="FBM">Fulfilled by Merchant (FBM)</option>
              {/* <option value="FBA">Fulfilled by Admin (FBA)</option> */}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Product Images</label>
          <input
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
          {previewUrls.length > 0 && (
            <div className="image-preview-container">
              {previewUrls.map((url, index) => (
                <img key={index} src={url} alt={`Preview ${index}`} className="image-preview" />
              ))}
            </div>
          )}
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/seller")}
          >
            Cancel
          </button>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
