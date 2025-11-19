import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Plus, Trash2, Download, FileJson, FileSpreadsheet, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const DeckManager = () => {
    const { decks, createDeck, deleteDeck, scannedCards } = useAppStore();
    const [newDeckName, setNewDeckName] = useState('');

    const handleCreateDeck = (e: React.FormEvent) => {
        e.preventDefault();
        if (newDeckName.trim()) {
            createDeck(newDeckName.trim());
            setNewDeckName('');
        }
    };

    const getDeckCards = (deckId: string) => {
        const deck = decks.find(d => d.id === deckId);
        if (!deck) return [];
        return deck.cards.map(cardId => scannedCards.find(c => c.id === cardId)).filter(Boolean);
    };

    const exportExcel = (deckId: string, deckName: string) => {
        const deckCards = getDeckCards(deckId);
        const worksheet = XLSX.utils.json_to_sheet(deckCards.map(c => ({
            Name: c?.name,
            Set: c?.setCode,
            Color: c?.color,
            Type: c?.type,
            Power: c?.power,
            Cost: c?.cost,
            Effect: c?.effectText
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Deck");
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        saveAs(data, `${deckName}_export.xlsx`);
    };

    const exportJSON = (deckId: string, deckName: string) => {
        const deckCards = getDeckCards(deckId);
        const data = new Blob([JSON.stringify(deckCards, null, 2)], { type: 'application/json' });
        saveAs(data, `${deckName}_export.json`);
    };

    const exportCSV = (deckId: string, deckName: string) => {
        const deckCards = getDeckCards(deckId);
        const headers = ["Name", "Set", "Color", "Type", "Power", "Cost", "Effect"];
        const csvContent = [
            headers.join(","),
            ...deckCards.map(c => [
                `"${c?.name}"`,
                `"${c?.setCode}"`,
                `"${c?.color}"`,
                `"${c?.type}"`,
                c?.power,
                c?.cost,
                `"${c?.effectText?.replace(/"/g, '""')}"`
            ].join(","))
        ].join("\n");

        const data = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
        saveAs(data, `${deckName}_export.csv`);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">My Decks</h3>
            </div>

            <form onSubmit={handleCreateDeck} className="flex gap-2">
                <Input
                    placeholder="New Deck Name..."
                    value={newDeckName}
                    onChange={(e) => setNewDeckName(e.target.value)}
                />
                <Button type="submit" disabled={!newDeckName.trim()}>
                    <Plus className="h-4 w-4 mr-2" /> Create
                </Button>
            </form>

            <div className="grid grid-cols-1 gap-4">
                {decks.map((deck) => (
                    <div key={deck.id} className="bg-white p-4 rounded-lg shadow-sm border">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-lg">{deck.name}</h4>
                            <div className="flex gap-2">
                                <div className="flex gap-1">
                                    <Button variant="outline" size="icon" onClick={() => exportExcel(deck.id, deck.name)} title="Export Excel">
                                        <FileSpreadsheet className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" onClick={() => exportJSON(deck.id, deck.name)} title="Export JSON">
                                        <FileJson className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" onClick={() => exportCSV(deck.id, deck.name)} title="Export CSV">
                                        <FileText className="h-4 w-4" />
                                    </Button>
                                </div>
                                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => deleteDeck(deck.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{deck.cards.length} cards</p>

                        {/* Mini Card List Preview */}
                        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                            {deck.cards.slice(0, 5).map(cardId => {
                                const card = scannedCards.find(c => c.id === cardId);
                                if (!card) return null;
                                return (
                                    <div key={cardId} className="w-16 h-20 bg-gray-100 rounded flex-shrink-0 overflow-hidden border text-[10px] p-1">
                                        {card.imageUrl ? (
                                            <img src={card.imageUrl} className="w-full h-full object-cover" />
                                        ) : (
                                            card.name
                                        )}
                                    </div>
                                );
                            })}
                            {deck.cards.length > 5 && (
                                <div className="w-16 h-20 bg-gray-50 rounded flex-shrink-0 border flex items-center justify-center text-xs text-muted-foreground">
                                    +{deck.cards.length - 5}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {decks.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground bg-gray-50 rounded-lg border border-dashed">
                        No decks created yet.
                    </div>
                )}
            </div>
        </div>
    );
};
