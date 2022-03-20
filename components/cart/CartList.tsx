import React, { FC } from 'react'
import NextLink from 'next/link';
import { Button, CardActionArea, CardMedia, Grid, Link, Typography } from '@mui/material';
import { initialData } from '../../database/products';
import { Box } from '@mui/system';
import { ItemCounter } from '../ui';

const productsInCart = [
  initialData.products[0],
  initialData.products[1],
  initialData.products[2],
]

interface Props {
  isEditable?: boolean;
}

export const CartList: FC<Props> = ({ isEditable = false}) => {
  return (
    
    <>
    {productsInCart.map((product) => (
      <Grid container spacing={2} key={product.slug} sx={{ mb: 1 }}>
        <Grid item xs={3}>
          <NextLink href={`/product/slug`} passHref>
            <Link>
            <CardActionArea>
              <CardMedia 
                image={`/products/${product.images[0]}`}
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
            <Typography variant='body1'>Talla: <strong>M</strong></Typography>

            {/* Condicional */}
            {isEditable ? <ItemCounter /> : <Typography variant='h6'>3 items</Typography>}
          </Box>
        </Grid>
        <Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
          <Typography variant='subtitle1'>{`$${product.price}`}</Typography>
          {isEditable && 
          <Button variant='text' color='secondary'>
            Remover
          </Button>
          }
        </Grid>
      </Grid>
    ))}
    </>


  )
}