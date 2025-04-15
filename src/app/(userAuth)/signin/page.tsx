'use client'
import React, {useState} from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/repository/prisma/NextAuthRepository";

 const SignIn = () => {
    const router = useRouter();
    const [username, setUsername] =useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const handleLogin = async (e: React.MouseEvent<HTMLElement, MouseEvent>) =>{
        e.preventDefault();
        const response = await signIn(email, username, password);
        console.log(response);
        router.push("/login");

    }
    const handleChange = () => {
        router.push('/login');
    }


    return (
        <div>
            <form>
            <label>name</label>
            <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}/>
            <label>email</label>
            <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}/>
            <label>password</label>
            <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}/>
            <button onClick={handleLogin}>新規登録</button>
            </form>
            <button　onClick={handleChange}>ログインはこちら</button>

        </div>
    );
};

export default SignIn;
