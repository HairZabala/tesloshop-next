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
    case 'POST':
      return loginUser(req, res);
    default:
      return res.status(400).json({ message: 'Endpoint no existe' });
  }
  
}

const loginUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    
    const { email = '', password = '' } = req.body;

    await db.connect();
    const user = await UserModel.findOne({email});
    await db.disconnect();

    if(!user){
      return res.status(400).json({ message: 'Usuario o contraseña invalidos.' });
    }

    if(!bcryptjs.compareSync(password, user.password!)){
      return res.status(400).json({ message: 'Usuario o contraseña invalidos.' });
    }

    const { role, name, _id } = user;

    const token = jwt.signToken(_id, email);

    return res.json({
      token,
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
