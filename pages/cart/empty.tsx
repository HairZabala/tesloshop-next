import React from 'react'
import NextLink from 'next/link';
import { Box, Link, Typography } from '@mui/material';
import { RemoveShoppingCartOutlined } from '@mui/icons-material';
import { ShopLayout } from '../../components/layouts/ShopLayout';


const EmptyPage = () => {
  return (
    <ShopLayout title='Carrito vacio' pageDescription='No hay artículos en el carrito de compras'>
      <Box sx={{ flexDirection: { xs: 'column', md: 'row' } }} display='flex' justifyContent={'center'} alignItems='center' height='calc(100vh - 200px)'>


        <RemoveShoppingCartOutlined sx={{ fontSize: 100 }} />
        <Box display={'flex'} flexDirection='column' alignItems={'center'}>
          <Typography>Su carrito está vació</Typography>
          <NextLink href="/" passHref>
            <Link typography={'h5'} color="secondary">
              Regresar
            </Link>
          </NextLink>
        </Box>
        
      </Box>
    </ShopLayout>
  )
}

export default EmptyPage