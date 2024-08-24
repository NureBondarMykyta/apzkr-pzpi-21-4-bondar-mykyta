import React, { useState } from 'react';
import axios from 'axios';

function LoginForm() {
    const [username, setUsername] = useState('bondar111');
    const [password, setPassword] = useState('Jk2879505855.');
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/v1/token/', {
                username,
                password,
            });

            setResult(response.data);
            setError(null);
        } catch (error) {
            setError(error.response ? error.response.data : error);
            setResult(null);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
            {result && (
                <div>
                    <h3>Result:</h3>
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
            )}
            {error && (
                <div>
                    <h3>Error:</h3>
                    <pre>{JSON.stringify(error, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

export default LoginForm;
