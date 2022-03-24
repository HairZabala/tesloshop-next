import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import UserModel from '../../../models/User';
import bcryptjs from 'bcryptjs';
import { jwt } from '../../../utils';

type Data = 
| { message: string }
| { 
  token: string, 
  user: {
    email: string,
    role: string,
    name: string,
  } 
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  
  switch(req.method){
    case 'GET':
      return checkJWT(req, res);
    default:
      return res.status(400).json({ message: 'Endpoint no existe' });
  }
  
}

const checkJWT = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    
    const { token } = req.cookies;

    let userId = '';
    try {
      userId = await jwt.isValidToken(token);
    } catch (error) {
      return res.status(401).json({ message: 'Token no es válido.' });
    }

    await db.connect();
    const user = await UserModel.findOne({userId});
    await db.disconnect();

    if(!user){
      return res.status(400).json({ message: 'No se encontro usuario en la base de datos.' });
    }

    const { role, name, _id, email } = user;

    return res.json({
      token: jwt.signToken(_id, email),
      user: {
        email, 
        role, 
        name
      }
    })


  } catch (error) {
    console.log(error);
  }
}
