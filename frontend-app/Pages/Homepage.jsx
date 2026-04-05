import { useContext } from "react"
import { ProductContext } from "../ApiContext/ProductContext"

function Homepage() {

    const data = useContext(ProductContext)
    console.log(data)

    return (
        <>
            {data?.map((item) => (
                <div style={{border:"0.2em solid white",padding:'0.2em'}} key={item._id}>
                    <h1>{item.title}</h1>
                    <p>{item.price}</p>
                    <p>{item.description}</p>
                </div>
            ))}
        </>
    )
}

export default Homepage