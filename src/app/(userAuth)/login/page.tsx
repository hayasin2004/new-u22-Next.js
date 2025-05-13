import React from 'react';

const Login = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleLoginAction = () => {
        setEmail('');
    }

    return (
        <div>
            <label>Email:</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
            <label>Password:</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLoginAction}>Login</button>
        </div>
    );
};

export default Login;