import React from 'react';

const SignIn = () => {
    const [email, setEmail] = React.useState('');
    const[username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const handleSignInAction = async () => {
        setEmail('');
    }
    return (
        <div>
            <label>email:</label>
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            <label>username:</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            <label>password:</label>
            <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleSignInAction}>SignIn</button>
        </div>
    );
};

export default SignIn;