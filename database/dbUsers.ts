import { User } from "../models";
import { db } from "./"
import bcryptjs from 'bcryptjs';

export  const checkUserEmailPassword = async(email: string, password: string ) => {
  await db.connect();
  const user = await User.findOne({email});
  await db.disconnect();

  if(!user){
    return null;
  }

  if(!bcryptjs.compareSync(password, user.password!)){
    return null;
  }

  const  { role, name, _id } =  user;

  return {
    _id, 
    email: email.toLocaleLowerCase(),
    role, 
    name
  }
}

// esta funcion crea o verifica mendiante un usuario de oauth
export const oAuthToDbUser = async(oAuthEmail: string, oAuthName: string) => {
  await db.connect();
  const user = await User.findOne({email: oAuthEmail});
  
  if(user){
    await db.disconnect();

    const  { role, name, _id, email } =  user;
    return { _id, email: email.toLocaleLowerCase(), role, name }
  }

  const newUser = new User({
    email: oAuthEmail,
    name: oAuthName,
    password: "@",
    role: 'client',
  })

  await newUser.save();
  await db.disconnect();

  const  { role, name, _id, email } =  newUser;
  return { _id, email: email.toLocaleLowerCase(), role, name }

}