import React, { FC } from 'react'
import { useContext } from 'react';
import NextLink from 'next/link';
import { Button, CardActionArea, CardMedia, Grid, Link, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { ItemCounter } from '../ui';
import { CartContext } from '../../context';
import { ICartProduct, IOrderItem } from '../../interfaces';
interface Props {
  isEditable?: boolean;
  products?: IOrderItem[];
}

export const CartList: FC<Props> = ({ isEditable = false, products}) => {

  const { cart, updateQuantityCartProduct, removeCartProduct } = useContext(CartContext);

  const updateQuantity = (product: ICartProduct, newQuantity: number) => {
    product.quantity = newQuantity;
    updateQuantityCartProduct(product);
  }

  const productsToShow = products ? products : cart;

  return (
    
    <>
    {productsToShow.map((product) => (
      <Grid container spacing={2} key={product.slug + product.size} sx={{ mb: 1 }}>
        <Grid item xs={3}>
          <NextLink href={`/product/${product.slug}`} passHref>
            <Link>
            <CardActionArea>
              <CardMedia 
                image={`/products/${product.image}`}
                component='img'
                sx={{ borderRadius: '5px' }}
              />
            </CardActionArea>
            </Link>
          </NextLink>
        </Grid>
        <Grid item xs={7}>
          <Box display={'flex'} flexDirection='column'>
            <Typography variant='body1'>{product.title}</Typography>
            <Typography variant='body1'>Talla: <strong>{product.size}</strong></Typography>

            {/* Condicional */}
            {isEditable 
              ? <ItemCounter currentValue={product.quantity} updateQuantity={(newQuantity) => updateQuantity(product as ICartProduct, newQuantity)} maxValue={10}/> 
              : <Typography variant='h6'>{product.quantity} {`${product.quantity > 1}` ? 'productos' : 'producto' }</Typography>}
          </Box>
        </Grid>
        <Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
          <Typography variant='subtitle1'>{`$${product.price}`}</Typography>
          {isEditable && 
          <Button variant='text' color='secondary' onClick={() => removeCartProduct(product as ICartProduct)}>
            Remover
          </Button>
          }
        </Grid>
      </Grid>
    ))}
    </>


  )
}
