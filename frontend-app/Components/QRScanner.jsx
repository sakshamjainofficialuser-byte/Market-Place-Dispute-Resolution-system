import React, { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import "./QRScanner.css";

const QRScanner = ({ onScanSuccess, onScanError, fps = 10, qrbox = 250 }) => {
    const scannerRef = useRef(null);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner("reader", {
            fps: fps,
            qrbox: qrbox,
            aspectRatio: 1.0
        });

        scanner.render(onScanSuccess, onScanError);

        return () => {
            scanner.clear().catch(error => {
                console.error("Failed to clear scanner", error);
            });
        };
    }, []);

    return (
        <div id="reader" style={{ width: "100%", maxWidth: "500px", margin: "0 auto" }}></div>
    );
};

export default QRScanner;
