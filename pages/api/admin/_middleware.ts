import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export async function middleware(req: any, ev: NextFetchEvent) {

  const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if(!session){
    return new Response( JSON.stringify({ message: 'No autorizado' }), {
      status: 401, 
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  const validUser = ['admin', 'super-user', 'SEO'];

  if(!validUser.includes(session.user.role)){
    return new Response( JSON.stringify({ message: 'No autorizado' }), {
      status: 401, 
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
  
  return NextResponse.next();

}