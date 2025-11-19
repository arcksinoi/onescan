import { useRef, useCallback, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { useAppStore } from '../../store/useAppStore';
import { identifyCard } from '../../services/gemini';
import { Button } from '../../components/ui/button';
import { Camera, Loader2, Zap, ZapOff } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Scanner = () => {
    const webcamRef = useRef<Webcam>(null);
    const { apiKey, settings, addCard, toggleAutoScan } = useAppStore();
    const [isProcessing, setIsProcessing] = useState(false);
    const [lastScanned, setLastScanned] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const captureAndIdentify = useCallback(async () => {
        if (!webcamRef.current || !apiKey || isProcessing) return;

        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) return;

        setIsProcessing(true);
        setError(null);

        try {
            const cardData = await identifyCard(apiKey, imageSrc);

            if (cardData) {
                const newCard = {
                    ...cardData,
                    id: crypto.randomUUID(),
                    timestamp: Date.now(),
                    imageUrl: imageSrc // Optional: save thumbnail
                };
                addCard(newCard);
                setLastScanned(newCard.card_name);

                // Clear toast after 3 seconds
                setTimeout(() => setLastScanned(null), 3000);
            }
        } catch (err) {
            console.error("Scan failed", err);
            // Don't show error to user in auto-mode to avoid spam, maybe just log it
            if (!settings.autoScan) {
                const errorMessage = err instanceof Error ? err.message : "Unknown error";
                setError(`Error: ${errorMessage}`);
            } else {
                // In auto-scan, still show a small error toast or log it to a visible debug area if needed
                // For now, let's update the error state so it can be seen if they stop auto-scan
                const errorMessage = err instanceof Error ? err.message : "Unknown error";
                setError(`Auto-scan Error: ${errorMessage}`);
            }
        } finally {
            setIsProcessing(false);
        }
    }, [apiKey, isProcessing, addCard, settings.autoScan]);

    // Auto-scan effect
    useEffect(() => {
        let intervalId: any;

        if (settings.autoScan && apiKey) {
            intervalId = setInterval(() => {
                if (!isProcessing) {
                    captureAndIdentify();
                }
            }, settings.scanInterval);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [settings.autoScan, settings.scanInterval, apiKey, isProcessing, captureAndIdentify]);

    return (
        <div className="relative flex flex-col items-center w-full max-w-md mx-auto space-y-4">
            {/* Camera Viewport */}
            <div className="relative w-full aspect-[3/4] bg-black rounded-xl overflow-hidden shadow-xl border-2 border-gray-800">
                <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ facingMode: "environment" }}
                    className="w-full h-full object-cover"
                />

                {/* Overlay UI */}
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4">
                    <div className="flex justify-between items-start">
                        {/* Status Indicator */}
                        <div className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md transition-colors",
                            settings.autoScan ? "bg-green-500/80 text-white" : "bg-black/50 text-white"
                        )}>
                            {settings.autoScan ? "AUTO SCAN ACTIVE" : "MANUAL MODE"}
                        </div>
                    </div>

                    {/* Scanning Reticle */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-50">
                        <div className="w-64 h-80 border-2 border-white/50 rounded-lg relative">
                            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white"></div>
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white"></div>
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white"></div>
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white"></div>
                        </div>
                    </div>
                </div>

                {/* Loading Overlay */}
                {isProcessing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 w-full justify-center">
                <Button
                    variant={settings.autoScan ? "destructive" : "secondary"}
                    onClick={toggleAutoScan}
                    className="flex-1"
                >
                    {settings.autoScan ? (
                        <><ZapOff className="mr-2 h-4 w-4" /> Stop Auto</>
                    ) : (
                        <><Zap className="mr-2 h-4 w-4" /> Start Auto</>
                    )}
                </Button>

                <Button
                    size="lg"
                    className="flex-1"
                    onClick={captureAndIdentify}
                    disabled={settings.autoScan || isProcessing}
                >
                    <Camera className="mr-2 h-4 w-4" /> Scan Now
                </Button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="text-red-500 text-sm bg-red-50 px-3 py-1 rounded-md">
                    {error}
                </div>
            )}

            {/* Toast Notification (Simple implementation) */}
            {lastScanned && (
                <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-black/90 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 z-50">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="font-medium">Scanned: {lastScanned}</span>
                </div>
            )}
        </div>
    );
};
