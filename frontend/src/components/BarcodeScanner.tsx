import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType, Html5QrcodeSupportedFormats } from 'html5-qrcode';

interface BarcodeScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (error: any) => void;
}

const qrcodeRegionId = "html5qr-code-full-region";

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScanSuccess, onScanError }) => {
  const [isScannerRunning, setIsScannerRunning] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // Initialize the scanner with specific formats for high accuracy on products
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 150 },
      rememberLastUsedCamera: true,
      supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
      formatsToSupport: [
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.EAN_8,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.UPC_E,
      ]
    };

    const html5QrcodeScanner = new Html5QrcodeScanner(qrcodeRegionId, config, false);
    scannerRef.current = html5QrcodeScanner;

    html5QrcodeScanner.render(
      (decodedText) => {
        // Automatically stop scanner on successful scan to prevent multiple calls
        if (scannerRef.current) {
           scannerRef.current.clear().catch(console.error);
           setIsScannerRunning(false);
        }
        onScanSuccess(decodedText);
      },
      (error) => {
        if (onScanError) {
          onScanError(error);
        }
      }
    );
    setIsScannerRunning(true);

    // Cleanup function when component unmounts
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Failed to clear html5QrcodeScanner. ", error);
        });
      }
    };
  }, [onScanSuccess, onScanError]);

  return (
    <div className="w-full flex flex-col items-center">
      <div id={qrcodeRegionId} className="w-full max-w-md overflow-hidden rounded-lg border-2 border-primary/50" />
      <p className="mt-4 font-body-sm text-text-secondary text-center">
        Position the barcode within the frame. It will scan automatically.
      </p>
    </div>
  );
};

export default BarcodeScanner;
