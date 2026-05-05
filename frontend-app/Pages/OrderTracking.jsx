import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import "./OrderTracking.css"

export default function OrderTracking() {
    const { orderItemId } = useParams()
    const navigate = useNavigate()
    const [tracking, setTracking] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchTimeline()
    }, [orderItemId])

    const fetchTimeline = async () => {
        try {
            const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"
            const res = await axios.get(`${API_BASE_URL}/qr/timeline/${orderItemId}`, {
                withCredentials: true
            })
            setTracking(res.data.tracking)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div className="tracking-page">Loading...</div>

    return (
        <div className="tracking-page">
            <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
            
            <div className="tracking-header">
                <h2>📦 Order Tracking</h2>
                <p>Item ID: {orderItemId?.slice(-6).toUpperCase()}</p>
                <div className={`status-pill status--${tracking?.currentStatus}`}>
                    {tracking?.currentStatus?.replace(/_/g, ' ')}
                </div>
            </div>

            <div className="timeline-container">
                {tracking?.timeline.map((step, index) => (
                    <div className="timeline-step" key={index}>
                        <div className="step-marker"></div>
                        <div className="step-content">
                            <div className="step-header">
                                <span className="step-stage">{step.stage.replace(/_/g, ' ')}</span>
                                <span className="step-time">{new Date(step.timestamp).toLocaleString()}</span>
                            </div>
                            <p className="step-actor">By: {step.scannedBy?.username} ({step.scannedBy?.role})</p>
                            {step.notes && <p className="step-notes">"{step.notes}"</p>}
                            
                            {step.photos && step.photos.length > 0 && (
                                <div className="step-photos">
                                    {step.photos.map((photo, pIdx) => (
                                        <img key={pIdx} src={photo.url} alt="Proof" className="step-photo" />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
