// import { useContext } from "react"
// import { ProductContext } from "../ApiContext/ProductContext"

// function Homepage() {

//     const data = useContext(ProductContext)
//     console.log(data)

//     return (
//         <>
//             {data?.map((item) => (
//                 <div style={{border:"0.2em solid white",padding:'0.2em'}} key={item._id}>
//                     <h1>{item.title}</h1>
//                     <p>${item.price}</p>
//                     <p>{item.description}</p>
//                 </div>
//             ))}
//         </>
//     )
// }

// export default Homepage 

import { useEffect, useState } from "react";
import axios from "axios";
import "./Homepage.css";

function Homepage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/homepage");
      setProducts(res.data);
    } catch (err) {
      console.log(err);
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
            <div className="homepage__card" key={item._id}>
              
              {/* Image */}
              <img
                src={item.image}
                alt={item.name}
                className="homepage__image"
              />

              {/* Info */}
              <h3 className="homepage__name">{item.name}</h3>
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