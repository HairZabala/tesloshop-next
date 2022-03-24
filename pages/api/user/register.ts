import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import User from '../../../models/User';
import bcryptjs from 'bcryptjs';
import { jwt, validations } from '../../../utils';

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
      return registerUser(req, res);
    default:
      return res.status(400).json({ message: 'Endpoint no existe' });
  }
  
}

const registerUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    
    const { email = '', password = '', name = '' } = req.body as { email: string, password: string, name: string };

    if(password.length < 6){
      return res.status(400).json({ message: 'Contraseña debe contener al menos 6 caracteres' });
    }

    if(name.length < 2){
      return res.status(400).json({ message: 'El nombre debe contener al menos dos letras' });
    }

    await db.connect();
    const user = await User.findOne({email});
    
    if(user){
      await db.disconnect();
      return res.status(400).json({ message: 'Correo ya se encuentra registrado en el sistema' });
    }
    
    if(!validations.isValidEmail(email)){
      return res.status(400).json({ message: 'Correo no valido' });
    }

    const newUser = new User({
      email,
      password: bcryptjs.hashSync(password),
      name,
    })

    try {
      await newUser.save();
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: 'Revisar los logs del servidor' });
    }

    const { role, _id } = newUser;

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
