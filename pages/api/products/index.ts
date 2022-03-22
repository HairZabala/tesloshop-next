import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { Product } from '../../../models'
import { IProduct } from '../../../interfaces/products';
import { SHOP_CONSTANTS } from '../../../database/constants';

type Data = 
| { message: string }
| IProduct[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  switch(req.method){
    case 'GET': 
      return getProducts(req, res)
    default:
      return res.status(400).json({ message: 'Bad request' })
  }

}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  
  const { gender = 'all' } = req.query;

  let query = {};

  if( gender !== 'all' && SHOP_CONSTANTS.validGenders.includes(`${gender}`) ){
    query = { gender };
  }

  db.connect();

  const products = await Product.find(query)
                                .select('title price inStock slug images -_id')
                                .lean();
  db.disconnect();

  return res.json(products);

}
