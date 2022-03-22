import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { IProduct } from '../../../interfaces';
import { Product } from '../../../models';

type Data = 
| { message: string }
| IProduct[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  switch (req.method) {
    case 'GET':
      return searchProducts(req, res);
      break;
    default:
      return res.status(400).json({ message: 'Bad request' })
  }
}
const searchProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

  try {
    
    let { query = ''} = req.query;    
  
    if(query.length === 0){
      return res.status(400).json({
        message: 'Debe indicar el termino de busqueda.'
      })
    }
  
    query = query.toString().toLocaleLowerCase();
    await db.connect();

    const products = await Product.find({
      $text: {
        $search: query
      }
    })
    .select('title price inStock slug images -_id')
    .lean()

    await db.disconnect();
  
    return res.json(products);
  } catch (error) {
    console.log(error);
    await db.disconnect();
    return res.status(400).json({message: 'Bad request'});
  }
  

}
