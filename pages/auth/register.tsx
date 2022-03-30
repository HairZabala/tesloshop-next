import React, { useState } from 'react'
import NextLink from 'next/link';
import { Box, Grid, TextField, Typography, Button, Link, Chip } from '@mui/material';
import { AuthLayout } from '../../components/layouts'
import { useForm } from 'react-hook-form';
import { tesloApi } from '../../api';
import { ErrorOutline } from '@mui/icons-material';
import { validations } from '../../utils';
import { useContext } from 'react';
import { AuthContext } from '../../context/auth/AuthContext';
import { useRouter } from 'next/router';


type FormData = {
  email: string;
  password: string;
  name: string;
};

const RegisterPage = () => {

  const router = useRouter();
  const { registerUser } = useContext(AuthContext);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const [showError, setShowError] = useState(false);
  const [erroMessage, setErroMessage] = useState('');

  const onRegisterUser = async ({ email,  password, name }: FormData) => {

    setShowError(false);
    const { hasError, message} = await registerUser(email, name, password);

    if(hasError){
      setShowError(true);
      setErroMessage(message || '');
      setTimeout(() => {
        setShowError(false);
        setErroMessage('');
      }, 3000);
      return;
    }

    const destination = router.query.p?.toString() || '/';
    router.replace(destination);

  }

  return (
    <AuthLayout title='Ingresar'>
      <form onSubmit={handleSubmit(onRegisterUser)} noValidate>
        <Box sx={{ width: 350, padding: '10px 20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='h1' component='h1'>Iniciar sesión</Typography>

              {showError && 
                <Chip 
                  label={erroMessage}
                  color="error"
                  icon={ <ErrorOutline /> }
                  className="fadeIn"
                  sx={{ mt: 2 }}
                />
              }

            </Grid>
            <Grid item xs={12}>
              <TextField 
                label='Nombre' 
                variant='filled' 
                fullWidth
                {...register('name', {
                  required: 'Este campo es requerido', 
                  minLength: { value: 2, message: 'Debe ingresar al menos 2 caracteres' }
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                label='Correo' 
                variant='filled' 
                fullWidth
                {...register('email', {
                  required: 'Este campo es requerido', 
                  validate: validations.isEmail
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                label='Contraseña' 
                variant='filled' 
                fullWidth
                {...register('password', {
                  required: 'Este campo es requerido', 
                  minLength: { value: 6, message: 'Debe ingresar al menos 6 caracteres' }
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" color="secondary" className='circular-btn' size='large' fullWidth>
                Ingresar
              </Button>
            </Grid>
            <Grid item xs={12} display='flex' justifyContent='end'>
              <NextLink href={router.query.p ? `/auth/login?p=${router.query.p}` : '/auth/login'} passHref>
                <Link underline='always'>
                ¿No tienes cuenta?
                </Link>
              </NextLink>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  )
}

export default RegisterPage