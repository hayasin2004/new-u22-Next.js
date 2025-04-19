'use client'
import React, {useState} from "react";
import { useRouter } from "next/navigation";
// import { signIn } from "@/repository/prisma/NextAuthRepository";

 const LogIn = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const handleLogin = async (e: React.MouseEvent<HTMLElement, MouseEvent>) =>{
        e.preventDefault();
        // ここでNextAuth認証が行われる
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });
        console.log(result);
        if(result?.error){
            window.alert(result?.error);
        }else{
            router.push('/Home');
        }

    }
    const handleChange = () => {
        router.push('/signin');
    }


    return (
        <div>
            <form>
            <label>email</label>
            <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}/>
            <label>password</label>
            <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}/>
            <button onClick={handleLogin}>ログイン</button>
            </form>
            <button onClick={handleChange}>新規登録へ</button>
        </div>
    );
};

export default LogIn;
