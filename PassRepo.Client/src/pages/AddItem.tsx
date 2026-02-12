import React, { useState } from 'react';
import { CryptoService } from '../services/CryptoService';
import api from '../services/ApiService';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { BottomNav } from '../components/ui/BottomNav';

const AddItem = () => {
    const { encryptionKey, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',      // Mapped to 'url' or 'title' in DB
        username: '',
        password: '',
        notes: ''
    });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!isAuthenticated || !encryptionKey) {
                navigate('/login');
                return;
            }

            const dataToEncrypt = {
                username: formData.username,
                password: formData.password,
                url: formData.title, // User inputs title/url
                notes: formData.notes
            };

            const { encryptedBlob, nonce } = await CryptoService.encrypt(dataToEncrypt, encryptionKey);

            await api.post('/vault', {
                encryptedBlob,
                nonce,
                isFavorite: false,
                logoId: 0
            });

            navigate('/vault'); // Go back to dashboard
        } catch (error) {
            console.error('Failed to save', error);
            alert('Kaydedilemedi');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white pb-24">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-zinc-800">
                <button onClick={() => navigate(-1)} className="p-2 text-zinc-400 hover:text-white">
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <h1 className="text-lg font-semibold">Yeni Kayıt Ekle</h1>
                <div className="w-10"></div> {/* Spacer for center alignment */}
            </header>

            <main className="p-6">
                <form onSubmit={handleSave} className="space-y-6">
                    {/* Identity Section */}
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-zinc-400 uppercase tracking-wider">HESAP BİLGİLERİ</label>

                        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
                            <input
                                placeholder="Başlık (Örn: Instagram)"
                                className="w-full bg-transparent p-4 text-white placeholder-zinc-600 focus:outline-none border-b border-zinc-800"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                            <input
                                placeholder="Kullanıcı Adı / Email"
                                className="w-full bg-transparent p-4 text-white placeholder-zinc-600 focus:outline-none"
                                value={formData.username}
                                onChange={e => setFormData({ ...formData, username: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    {/* Password Section */}
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-zinc-400 uppercase tracking-wider">GÜVENLİK</label>

                        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden flex items-center pr-4">
                            <input
                                type="password"
                                placeholder="Şifre"
                                className="w-full bg-transparent p-4 text-white placeholder-zinc-600 focus:outline-none font-mono tracking-widest"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                        <button type="button" className="text-xs text-indigo-400 font-medium ml-1">Güçlü Şifre Oluştur</button>
                    </div>

                    {/* Notes Section */}
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-zinc-400 uppercase tracking-wider">NOTLAR</label>
                        <textarea
                            placeholder="Eklemek istediğiniz notlar..."
                            className="w-full bg-zinc-900 rounded-2xl border border-zinc-800 p-4 text-white placeholder-zinc-600 focus:outline-none min-h-[100px]"
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                        Kaydet
                    </button>
                </form>
            </main>

            <BottomNav />
        </div>
    );
};

export default AddItem;
