import { NextResponse } from 'next/server';

export default async function middleware(req) {
 const idToken = req.cookies.get("idToken");
 if(!idToken) {
    console.log("No idToken found");
 }
 return NextResponse.next();
}
