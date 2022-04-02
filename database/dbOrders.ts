import { IOrder } from "../interfaces" 
import { isValidObjectId, ObjectId } from "mongoose" 
import { db } from ".";
import { Order } from "../models";

export const getOrderById = async(id: string): Promise<IOrder|null> => {

  if(!isValidObjectId(id)){
    return null;
  }

  db.connect();

  const order = await Order.findById(id).lean();
  db.disconnect();
  
  if(!order){
    return null;
  }

  return JSON.parse(JSON.stringify(order));

}

export const getOrdersByUser = async(id: string): Promise<IOrder[]> => {

  if(!isValidObjectId(id)){
    return [];
  }

  db.connect();
  console.log({ user: id });
  const orders = await Order.find({ user: id }).lean();
  db.disconnect();
  
  return JSON.parse(JSON.stringify(orders));
}