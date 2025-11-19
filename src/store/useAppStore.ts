import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Card {
    id: string;
    name: string;
    power?: number;
    cost?: number;
    attribute?: string;
    type?: string;
    color?: string;
    effectText?: string;
    setCode?: string;
    rarity?: string;
    counter?: number;
    life?: number;
    tags?: string[];
    timestamp: number;
    imageUrl?: string;
}

export interface Deck {
    id: string;
    name: string;
    cards: string[]; // Array of Card IDs
    createdAt: number;
}

interface AppState {
    apiKey: string;
    scannedCards: Card[];
    decks: Deck[];
    settings: {
        autoScan: boolean;
        scanInterval: number;
    };

    setApiKey: (key: string) => void;
    addCard: (card: Card) => void;
    updateCard: (id: string, updates: Partial<Card>) => void;
    removeCard: (id: string) => void;

    createDeck: (name: string) => void;
    deleteDeck: (id: string) => void;
    addCardToDeck: (deckId: string, cardId: string) => void;
    removeCardFromDeck: (deckId: string, cardId: string) => void;

    toggleAutoScan: () => void;
    setScanInterval: (ms: number) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            apiKey: '',
            scannedCards: [],
            decks: [],
            settings: {
                autoScan: false,
                scanInterval: 3000,
            },

            setApiKey: (key) => set({ apiKey: key }),

            addCard: (card) => set((state) => ({
                scannedCards: [card, ...state.scannedCards]
            })),

            updateCard: (id, updates) => set((state) => ({
                scannedCards: state.scannedCards.map((c) =>
                    c.id === id ? { ...c, ...updates } : c
                )
            })),

            removeCard: (id) => set((state) => ({
                scannedCards: state.scannedCards.filter((c) => c.id !== id),
                // Also remove from decks
                decks: state.decks.map(d => ({
                    ...d,
                    cards: d.cards.filter(cid => cid !== id)
                }))
            })),

            createDeck: (name) => set((state) => ({
                decks: [...state.decks, {
                    id: crypto.randomUUID(),
                    name,
                    cards: [],
                    createdAt: Date.now()
                }]
            })),

            deleteDeck: (id) => set((state) => ({
                decks: state.decks.filter((d) => d.id !== id)
            })),

            addCardToDeck: (deckId, cardId) => set((state) => ({
                decks: state.decks.map((d) =>
                    d.id === deckId ? { ...d, cards: [...d.cards, cardId] } : d
                )
            })),

            removeCardFromDeck: (deckId, cardId) => set((state) => ({
                decks: state.decks.map((d) =>
                    d.id === deckId ? { ...d, cards: d.cards.filter((c) => c !== cardId) } : d
                )
            })),

            toggleAutoScan: () => set((state) => ({
                settings: { ...state.settings, autoScan: !state.settings.autoScan }
            })),

            setScanInterval: (ms) => set((state) => ({
                settings: { ...state.settings, scanInterval: ms }
            })),
        }),
        {
            name: 'op-tcg-scanner-storage',
        }
    )
);
