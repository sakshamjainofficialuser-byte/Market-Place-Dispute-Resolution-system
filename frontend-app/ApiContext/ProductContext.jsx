import { createContext, useEffect, useState } from "react";
import axios from "axios"
const API_BASE_URL = import.meta.env.VITE_API_URL


export const ProductContext = createContext()


function ProductContextProvider({children}) {

    const [products,setProduct] = useState([])

    async function fetchProducts() {
        const response = await axios.get(`${API_BASE_URL}/homepage/users`)
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