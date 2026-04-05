import { createContext, useEffect, useState } from "react";
import axios from "axios"


export const ProductContext = createContext()

function ProductContextProvider({children}) {

    const [products,setProduct] = useState([])

    async function fetchProducts() {
        const response = await axios.get("http://localhost:5000/homepage/users")
        console.log(response.data.products)
        setProduct(response.data.products)
    }

    useEffect(() => {
        fetchProducts()
    },[])

    return (
        <ProductContext.Provider value={products}>
            {children}
        </ProductContext.Provider>
    )
}

export default ProductContextProvider