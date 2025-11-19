import { useState } from 'react';
import { useAppStore, type Card } from '../../store/useAppStore';
import { Button } from '../../components/ui/button';
import { Trash2, Pencil } from 'lucide-react';
import { EditCardModal } from '../cards/EditCardModal';

export const RecentScans = () => {
    const { scannedCards, removeCard, decks, addCardToDeck } = useAppStore();
    const [editingCard, setEditingCard] = useState<Card | null>(null);

    if (scannedCards.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recent Scans</h3>
            <div className="grid grid-cols-1 gap-4">
                {scannedCards.map((card) => (
                    <div key={card.id} className="bg-white p-4 rounded-lg shadow-sm border flex items-start justify-between gap-4">
                        <div className="flex gap-4">
                            {card.imageUrl && (
                                <img src={card.imageUrl} alt={card.name} className="w-16 h-20 object-cover rounded bg-gray-100" />
                            )}
                            <div>
                                <h4 className="font-bold">{card.name}</h4>
                                <div className="text-sm text-muted-foreground space-y-1">
                                    <p>{card.color} {card.type}</p>
                                    <p>Power: {card.power || '-'} | Cost: {card.cost || '-'}</p>
                                    <p className="text-xs">{card.setCode}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 items-end">
                            <div className="flex gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setEditingCard(card)}
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => removeCard(card.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Simple Add to Deck Dropdown */}
                            {decks.length > 0 && (
                                <select
                                    className="text-xs border rounded p-1 max-w-[100px]"
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            addCardToDeck(e.target.value, card.id);
                                            e.target.value = ""; // Reset
                                        }
                                    }}
                                >
                                    <option value="">Add to...</option>
                                    {decks.map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {editingCard && (
                <EditCardModal
                    card={editingCard}
                    onClose={() => setEditingCard(null)}
                />
            )}
        </div>
    );
};
