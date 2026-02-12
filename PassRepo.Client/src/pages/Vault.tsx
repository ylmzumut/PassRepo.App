import React, { useEffect, useState } from 'react';
import api from '../services/ApiService';
import { CryptoService } from '../services/CryptoService';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

interface VaultItem {
    id: string;
    username: string;
    url: string;
    notes: string;
    decryptedPassword?: string;
}

const Vault = () => {
    const { encryptionKey, isAuthenticated } = useAuthStore();
    const [items, setItems] = useState<VaultItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const navigate = useNavigate();

    // New Item Form State
    const [newItem, setNewItem] = useState({ username: '', password: '', url: '', notes: '' });

    useEffect(() => {
        if (!isAuthenticated || !encryptionKey) {
            navigate('/login');
            return;
        }
        fetchItems();
    }, [isAuthenticated, encryptionKey]);

    const fetchItems = async () => {
        try {
            const res = await api.get('/vault');
            const encryptedItems = res.data;

            const decryptedItems = await Promise.all(encryptedItems.map(async (item: any) => {
                try {
                    const decryptedData = await CryptoService.decrypt(item.encryptedBlob, item.nonce, encryptionKey!);
                    return { ...item, ...decryptedData };
                } catch (e) {
                    console.error('Decryption failed for item', item.id, e);
                    return { ...item, username: 'Error decrypting', url: '', notes: '' };
                }
            }));

            setItems(decryptedItems);
        } catch (error) {
            console.error('Failed to fetch vault', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!encryptionKey) return;

            const dataToEncrypt = {
                username: newItem.username,
                password: newItem.password, // Raw password
                url: newItem.url,
                notes: newItem.notes
            };

            const { encryptedBlob, nonce } = await CryptoService.encrypt(dataToEncrypt, encryptionKey);

            await api.post('/vault', {
                encryptedBlob,
                nonce,
                isFavorite: false,
                logoId: 0
            });

            setShowAddModal(false);
            setNewItem({ username: '', password: '', url: '', notes: '' });
            fetchItems(); // Refresh list
        } catch (error) {
            console.error('Failed to add item', error);
            alert('Failed to add item');
        }
    };

    if (loading) return <div>Loading vault...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h2>My Vault</h2>
            <button onClick={() => setShowAddModal(true)} style={{ marginBottom: '20px', padding: '10px' }}>
                + Add New Item
            </button>

            <div style={{ display: 'grid', gap: '10px' }}>
                {items.map(item => (
                    <div key={item.id} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
                        <h3>{item.url || 'No URL'}</h3>
                        <p><strong>Username:</strong> {item.username}</p>
                        <p><strong>Password:</strong> {item.decryptedPassword || '******'} <button onClick={() => alert(item.decryptedPassword || newItem.password)}>Show</button></p>
                        {item.notes && <p><em>{item.notes}</em></p>}
                    </div>
                ))}
            </div>

            {showAddModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div style={{ background: 'white', padding: '20px', borderRadius: '5px', width: '300px' }}>
                        <h3>Add Item</h3>
                        <form onSubmit={handleAddItem}>
                            <input placeholder="URL" value={newItem.url} onChange={e => setNewItem({ ...newItem, url: e.target.value })} style={{ display: 'block', width: '100%', marginBottom: '5px' }} />
                            <input placeholder="Username" value={newItem.username} onChange={e => setNewItem({ ...newItem, username: e.target.value })} style={{ display: 'block', width: '100%', marginBottom: '5px' }} />
                            <input type="password" placeholder="Password" value={newItem.password} onChange={e => setNewItem({ ...newItem, password: e.target.value })} style={{ display: 'block', width: '100%', marginBottom: '5px' }} />
                            <textarea placeholder="Notes" value={newItem.notes} onChange={e => setNewItem({ ...newItem, notes: e.target.value })} style={{ display: 'block', width: '100%', marginBottom: '5px' }} />
                            <button type="submit">Save</button>
                            <button type="button" onClick={() => setShowAddModal(false)} style={{ marginLeft: '10px' }}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Vault;
