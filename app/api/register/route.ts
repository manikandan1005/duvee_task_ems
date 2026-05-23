import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";


const jsonFileData=path.join(process.cwd(),"app","data","auth.json")

export async function POST(request:Request){

    const requestData=await request.json();

    const dbDataJson=fs.readFileSync(jsonFileData,"utf-8");

    const dbData= dbDataJson?JSON.parse(dbDataJson):[];


    const isExist =dbData.filter((i:any)=>i.username===requestData.username)

   if( isExist.length!==0) return NextResponse.json({start:false,message:"user already exist"})

    const newUser={
        id:crypto.randomUUID(),
        ...requestData
    }

    dbData.push(newUser)
    fs.writeFileSync(jsonFileData,JSON.stringify(dbData,null,2))
     return NextResponse.json({message:"user created successfully"})
}