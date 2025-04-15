"use server";
import prisma from "@/lib/prismaClient"

export const signIn = async (email:string,username:string,password:string)=> {
    console.log(email,username,password);
    const newUser = await prisma.user.create({
        data:{
            email :email,
            username:username,
            password:password
        }
    })
    if (newUser){
        console.log('newUser' + newUser);
        return newUser;
    }

}

export const logIn = async (userId:number)=> {
    try {
        if(userId !== undefined){
            console.log('ログイン確認')
            const loginUser = await prisma.user.findFirst({
                where:{
                    id:userId,
                }

            });
            if(loginUser!.status == 200){
                return {status:200,loginUser}
            }
            else if(loginUser!.status == 201){
                return {status:200,loginUser}
            }
            else {
                console.log('すでにユーザーデータが存在してます');
                return{status:'error',message:'おかえりなさい'}
            }

        }
        else {
            return{status:'error',message:'ユーザーが見つからなかった'}
        }
    }
    catch (error) {
        console.log(error);
        return{status:'error',message:'ユーザーが見つからなかった'}
    }
}
console.log('logIn'+JSON.stringify(logIn));