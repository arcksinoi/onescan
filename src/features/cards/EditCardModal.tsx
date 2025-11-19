import { useState } from 'react';
import { useAppStore, type Card } from '../../store/useAppStore';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { X } from 'lucide-react';

interface EditCardModalProps {
    card: Card;
    onClose: () => void;
}

export const EditCardModal = ({ card, onClose }: EditCardModalProps) => {
    const { updateCard } = useAppStore();
    const [formData, setFormData] = useState({ ...card });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        updateCard(card.id, formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Edit Card</h2>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <Input name="name" value={formData.name} onChange={handleChange} />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Set Code</label>
                            <Input name="setCode" value={formData.setCode || ''} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Rarity</label>
                            <Input name="rarity" value={formData.rarity || ''} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Color</label>
                            <Input name="color" value={formData.color || ''} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Type</label>
                            <Input name="type" value={formData.type || ''} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Attribute</label>
                            <Input name="attribute" value={formData.attribute || ''} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-1">
                            <label className="block text-sm font-medium mb-1">Power</label>
                            <Input
                                name="power"
                                type="number"
                                value={formData.power || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, power: Number(e.target.value) }))}
                            />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-sm font-medium mb-1">Cost</label>
                            <Input
                                name="cost"
                                type="number"
                                value={formData.cost || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, cost: Number(e.target.value) }))}
                            />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-sm font-medium mb-1">Counter</label>
                            <Input
                                name="counter"
                                type="number"
                                value={formData.counter || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, counter: Number(e.target.value) }))}
                            />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-sm font-medium mb-1">Life</label>
                            <Input
                                name="life"
                                type="number"
                                value={formData.life || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, life: Number(e.target.value) }))}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                        <Input
                            name="tags"
                            value={formData.tags?.join(', ') || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value.split(',').map(t => t.trim()) }))}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Effect Text</label>
                        <textarea
                            name="effectText"
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.effectText || ''}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button onClick={handleSave}>Save Changes</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
