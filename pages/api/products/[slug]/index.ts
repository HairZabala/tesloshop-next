import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../../database';
import { IProduct } from '../../../../interfaces'
import { Product } from '../../../../models';

type Data = 
| { message: string }
| IProduct

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  
  switch (req.method) {
    case 'GET':
      return getProductBySlud(req, res);
    default:
      return res.status(400).json({message: 'Endpoint no existe'});
  }

}

const getProductBySlud = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  
  try {
    await db.connect();

    const { slug } = req.query;
  
    const product = await Product.findOne({slug}).lean();

    if(!product){
      await db.disconnect();
      return res.status(404).json({message: 'Producto no encontrado'});
    }

    await db.disconnect();
    
    return res.json(product);

  } catch (error) {
    console.log(error);
    await db.disconnect();
    return res.status(400).json({message: 'Bad request'});
  }

}

