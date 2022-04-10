import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { jwt } from "../../utils";

export async function middleware(req: any, ev: NextFetchEvent) {

  const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  const url = req.nextUrl.clone()
  if(!session){
    url.pathname = '/auth/login';
    url.search = `p=${req.page.name}`;
    return NextResponse.redirect(url);
  }

  const validUser = ['admin', 'super-user', 'SEO'];

  if(!validUser.includes(session.user.role)){
    url.pathname = '/';
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();

}