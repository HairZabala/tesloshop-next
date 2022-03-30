import React, {useEffect, useState} from 'react'
import NextLink from 'next/link';
import { GetServerSideProps } from 'next'
import { Box, Grid, TextField, Typography, Button, Link, Chip, Divider } from '@mui/material';
import { AuthLayout } from '../../components/layouts'
import { useForm } from 'react-hook-form';
import { validations } from '../../utils';
import { ErrorOutline } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { getSession, signIn, getProviders } from 'next-auth/react';

type FormData = {
  email: string,
  password: string,
};

const LoginPage = () => {

  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const [showError, setShowError] = useState(false);

  const [providers, setProvider] = useState<any>({});

  useEffect(() => {
    getProviders().then( prov => {
      console.log({prov});
      setProvider(prov);
    });
  }, [])
  

  const onLoginUser = async ({ email,  password }: FormData) => {

    setShowError(false);
    // const isValidLogin = await loginUser(email, password);

    // if(!isValidLogin){
    //   setShowError(true);
    //   setTimeout(() => {
    //     setShowError(false);
    //   }, 3000);
    //   return;
    // }

    // const destination = router.query.p?.toString() || '/';
    // router.replace(destination);

    signIn('credentials', { email, password});

  }

  return (
    <AuthLayout title='Ingresar'>
      <form onSubmit={handleSubmit(onLoginUser)} noValidate>
        <Box sx={{ width: 350, padding: '10px 20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='h1' component='h1'>Iniciar sesión</Typography>

              {showError && 
                <Chip 
                  label="Correo o contraseña invalidos"
                  color="error"
                  icon={ <ErrorOutline /> }
                  className="fadeIn"
                  sx={{ mt: 2 }}
                />
              }

            </Grid>
            <Grid item xs={12}>
              <TextField 
                type='email'
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
                type='password'
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
              <Button type='submit' color="secondary" className='circular-btn' size='large' fullWidth>
                Ingresar
              </Button>
            </Grid>
            <Grid item xs={12} display='flex' justifyContent='end'>
              <NextLink  href={router.query.p ? `/auth/register?p=${router.query.p}` : '/auth/register'} passHref>
                <Link underline='always'>
                ¿No tienes cuenta?
                </Link>
              </NextLink>
            </Grid>
            
            <Grid item xs={12} display='flex' justifyContent='end' flexDirection='column'>
              <Divider sx={{ width: '100%', mb: 2 }}/>
              {
                Object.values(providers).map((provider: any) => {

                  if(provider.id === 'credentials') return (<div key="credentials"></div>);

                  return (
                    <Button
                      key={provider.id}
                      variant='outlined'
                      fullWidth
                      color='primary'
                      sx={{ mb: 1 }}
                      onClick={ () => signIn(provider.id) }
                    >
                      {provider.name}
                    </Button>
                  )
                })
              }
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  )
}
// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  
  const session = await getSession({ req });
  const { p ='/' } = query;

  if(session){
    return {
      redirect: {
        destination: p.toString(),
        permanent: false
      }
    }
  }

  return {
    props: { }
  }
}

export default LoginPage