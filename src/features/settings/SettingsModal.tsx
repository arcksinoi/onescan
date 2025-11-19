import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { X, Settings as SettingsIcon } from 'lucide-react';

export const SettingsModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { apiKey, setApiKey, settings, toggleAutoScan, setScanInterval } = useAppStore();
    const [localKey, setLocalKey] = useState(apiKey);

    useEffect(() => {
        setLocalKey(apiKey);
    }, [apiKey]);

    const handleSave = () => {
        setApiKey(localKey);
        setIsOpen(false);
    };

    if (!isOpen) {
        return (
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
                <SettingsIcon className="h-6 w-6" />
            </Button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Settings</h2>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Google Gemini API Key</label>
                        <Input
                            type="password"
                            value={localKey}
                            onChange={(e) => setLocalKey(e.target.value)}
                            placeholder="Enter your API Key"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Your key is stored locally on your device.
                        </p>
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Auto-Scan Mode</label>
                        <Button
                            variant={settings.autoScan ? "default" : "outline"}
                            onClick={toggleAutoScan}
                        >
                            {settings.autoScan ? "On" : "Off"}
                        </Button>
                    </div>

                    {settings.autoScan && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Scan Interval (ms)</label>
                            <Input
                                type="number"
                                value={settings.scanInterval}
                                onChange={(e) => setScanInterval(Number(e.target.value))}
                            />
                        </div>
                    )}

                    <div className="pt-4 flex justify-end">
                        <Button onClick={handleSave}>Save Settings</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
