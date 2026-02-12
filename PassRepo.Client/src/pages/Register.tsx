import React, { useState } from 'react';
import { CryptoService } from '../services/CryptoService';
import api from '../services/ApiService';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 1. Generate Salt
            const salt = await CryptoService.generateSalt();

            // 2. Derive Keys from Password + Salt
            const { authKey } = await CryptoService.deriveKeys(password, salt);

            // 3. Send to API: Email, AuthKey, Salt
            await api.post('/auth/register', {
                email,
                authKeyHash: authKey, // Sending derived AuthKey as the "hash"
                salt
            });

            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (error) {
            console.error('Registration failed', error);
            alert('Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
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
                    {loading ? 'Processing...' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default Register;
