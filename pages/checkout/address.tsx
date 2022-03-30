import React, { useContext } from 'react'
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import { Typography, Grid, TextField, FormControl, MenuItem, Box, Button } from '@mui/material';

import { ShopLayout } from '../../components/layouts/ShopLayout';
import { countries } from '../../utils';
import { CartContext } from '../../context';

type FormData = {
  firstName: string;
  lastName: string;
  address: string;
  address2: string;
  zip: string;
  city: string;
  country: string;
  phone: string;
};

const getAddressFromCookies = (): FormData => {
  return {
    firstName: Cookies.get('firstName') || '',
    lastName: Cookies.get('lastName') || '',
    address: Cookies.get('address') || '',
    address2: Cookies.get('address2') || '',
    zip: Cookies.get('zip') || '',
    city: Cookies.get('city') || '',
    country: Cookies.get('country') || '',
    phone: Cookies.get('phone') || '',
  }
}


const AddressPage = () => {

  const router = useRouter();

  const { updateShippingAddress } = useContext(CartContext);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: getAddressFromCookies()
  });

  const onRevisarPedido = async (data: FormData) => {
    updateShippingAddress(data);
    router.push('/checkout/summary');
  }

  return (
    <ShopLayout title='Dirección' pageDescription='Confirmar dirección del destino'>
      <Typography variant='h1' component='h1'>Dirección</Typography>
      <form onSubmit={handleSubmit(onRevisarPedido)} noValidate>

        <Box>

          <Grid container spacing={2} sx={{ mt: 2}}>

            <Grid item xs={12} sm={6}>
              <TextField 
                label='Nombre' 
                variant='filled' 
                fullWidth 
                {...register('firstName', {
                  required: 'Nombre es requerido', 
                })}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                label='Apellido' 
                variant='filled' 
                fullWidth 
                {...register('lastName', {
                  required: 'Apellido es requerido', 
                })}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField 
                label='Dirrección' 
                variant='filled' 
                fullWidth
                {...register('address', {
                  required: 'Dirección es requerida', 
                })}
                error={!!errors.address}
                helperText={errors.address?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                label='Dirrección 2 (opcional)' 
                variant='filled' 
                fullWidth 
                {...register('address2')}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField 
                label='Código Postal' 
                variant='filled' 
                fullWidth 
                {...register('zip', {
                  required: 'Código postal es requerido', 
                })}
                error={!!errors.zip}
                helperText={errors.zip?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                label='Ciudad' 
                variant='filled' 
                fullWidth 
                {...register('city', {
                  required: 'Ciudad es requerida', 
                })}
                error={!!errors.city}
                helperText={errors.city?.message}
              />
            </Grid>


            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField 
                  select
                  variant='filled' 
                  label='País' 
                  defaultValue={Cookies.get('country') || countries[0].code}
                  {...register('country')}
                >
                  {countries.map((countrie) => (
                    <MenuItem key={countrie.code} value={countrie.code}>{countrie.name}</MenuItem>
                  ))}
                </TextField>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                label='Teléfono' 
                variant='filled'
                fullWidth 
                {...register('phone', {
                  required: 'Teléfono es requerido', 
                })}
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
            </Grid>

          </Grid>

          <Box sx={{ mt: 5 }} display='flex' justifyContent='center'>
            <Button type="submit" color='secondary' className='circular-btn' size='large'>
              Revisar pedido
            </Button>
          </Box>
        </Box>
      </form>

    </ShopLayout>
  )
}

export default AddressPage