import { useContext } from "react"
import { ProductContext } from "../ApiContext/ProductContext"

function Homepage() {

    const data = useContext(ProductContext)
    console.log(data)

    return (
        <>
            <div style={{display:"flex",flexWrap:"wrap"}}>
            {data?.map((item) => (
                <div style={{width:"15em", border:"0.2em solid black",padding:'0.2em',margin:"0.5rem"}} key={item._id}>
                    <img style={{width:"14em", height:"20rem"}} src={item.images[0]}/>
                    <h1>{item.title}</h1>
                    <p>₹ {item.price}</p>
                    <p>{item.description}</p>
                </div>
            ))}
            </div>
        </>
    )
}

export default Homepage