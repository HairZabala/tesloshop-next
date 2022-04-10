import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { Order, Product, User } from '../../../models'

type Data = {
  numberOfOrders: number
  paidOrders: number
  notPaidOrders: number
  numberOfClients: number
  numberOfProducts: number
  productWithNoInventory: number
  lowInventory: number
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  
  await db.connect();

  const [orders, clients, products] = await Promise.all([
    Order.find(),
    User.find({ role: 'client' }),
    Product.find(),
  ]) 
;
  await db.disconnect();
  
  res.status(200).json({
    numberOfOrders: orders.length,
    paidOrders: orders.filter(ord => ord.isPaid).length,
    notPaidOrders: orders.filter(ord => !ord.isPaid).length,
    numberOfClients: clients.length,
    numberOfProducts: products.length,
    productWithNoInventory: products.filter(pro => pro.inStock === 0).length,
    lowInventory: products.filter(pro => pro.inStock <= 10).length,
  });
}