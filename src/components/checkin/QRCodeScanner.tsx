/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { toast } from "react-toastify";

interface Props {
  onDetected: (registrationId: string) => Promise<void>;
}

export default function QRCodeScanner({ onDetected }: Props) {
  const qrCodeRegionId = "qr-reader";
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isBusyReading, setIsBusyReading] = useState(false);

  const startScanner = async () => {
    if (isScanning) return;

    if (!html5QrCodeRef.current) {
      html5QrCodeRef.current = new Html5Qrcode(qrCodeRegionId);
    }

    const cameras = await Html5Qrcode.getCameras();
    if (cameras && cameras.length) {
      const cameraId = cameras[0].id;

      html5QrCodeRef.current
        .start(
          cameraId,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            disableFlip: true,
          },
          async (decodedText) => {
            if (isBusyReading) return;

            setIsBusyReading(true);
            try {
              await onDetected(decodedText);
            } catch (err: any) {
              toast.error("Erro ao processar QR Code");
              console.log(err);
            }

            // Reseta a câmera e aguarda 3 segundos para nova leitura
            await stopScanner();
            setTimeout(() => {
              startScanner(); // reinicia a câmera após delay
            }, 3000);
          },
          (errorMessage) => {
            if (!errorMessage.includes("NotFoundException")) {
              toast.error(errorMessage);
            }
            console.warn(errorMessage);
          }
        )
        .then(() => setIsScanning(true))
        .catch((err) => {
          console.error("Erro ao iniciar câmera:", err);
        });
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current?.isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        await html5QrCodeRef.current.clear();
        setIsScanning(false);
        setIsBusyReading(false); // libera leitura futura
      } catch (err) {
        console.error("Erro ao parar câmera:", err);
      }
    }
  };

  useEffect(() => {
    startScanner();
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="w-full max-w-md mx-auto text-center space-y-4">
      <div id={qrCodeRegionId} className="w-full" />
      <div className="flex justify-center gap-4">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={startScanner}
          disabled={isScanning}
        >
          Iniciar leitura
        </button>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={stopScanner}
          disabled={!isScanning}
        >
          Parar câmera
        </button>
      </div>
    </div>
  );
}
