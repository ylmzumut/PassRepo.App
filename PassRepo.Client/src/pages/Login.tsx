import React, { useState } from 'react';
import { CryptoService } from '../services/CryptoService';
import api from '../services/ApiService';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const setAuth = useAuthStore((state) => state.setAuth);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 1. Fetch Salt from API
            const saltRes = await api.get(`/auth/salt/${email}`);
            const salt = saltRes.data.salt;

            if (!salt) throw new Error('User not found or no salt');

            // 2. Derive Keys from Password + Salt (Client-Side)
            const { encryptionKey, authKey } = await CryptoService.deriveKeys(password, salt);

            // 3. Send AuthKey to API to login
            const loginRes = await api.post('/auth/login', {
                email,
                authKeyHash: authKey
            });

            const { token, userId } = loginRes.data;

            // 4. Store Token in LocalStorage (but NOT keys!)
            localStorage.setItem('token', token);

            // 5. Store Keys in Memory (Zustand)
            setAuth({ id: userId, email }, encryptionKey, authKey);

            navigate('/vault');
        } catch (error) {
            console.error('Login failed', error);
            alert('Login failed: Invalid credentials or user not found.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Master Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <button type="submit" disabled={loading} style={{ padding: '10px 20px' }}>
                    {loading ? 'Processing...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default Login;
