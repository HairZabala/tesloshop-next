import type { NextPage, GetServerSideProps } from 'next'
import { Typography, Box } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products/ProductList';
import { dbProducts } from '../../database';
import { IProduct } from '../../interfaces';

interface Props {
  products: IProduct[];
  foundProjects: boolean;
  query: string;
}

const SearchPage: NextPage<Props> = ({ products, foundProjects, query }) => {

  return (
    <ShopLayout title='Teslo-Shop - Search' pageDescription='Encuentra los mejores productos de tesla shop'>
      <Typography variant='h1' component={'h1'} textTransform='capitalize'>Buscar producto</Typography>

      { foundProjects 
        ? <Typography variant='h2' sx={{ mb: 1 }}>Producto: {query}</Typography>
        : (
          <Box display='flex'>
            <Typography variant='h2' sx={{ mb: 1 }}>No se encontraron productos para: </Typography>
            <Typography variant='h2' sx={{ ml: 1 }} color='secondary' textTransform='capitalize'>{query}</Typography>
          </Box>
        )
      }
      
      
      <ProductList products={ products } />
    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async ({params}) => {
  
  const { query } = params as { query:string }

  let products = await dbProducts.getProductsByTerm(query);
  
  const foundProjects = products.length > 0;
  
  if(!foundProjects){
    products = await dbProducts.getProductsByTerm('shirts');
    // products = await dbProducts.getAllProducts();
  }

  return {
    props: {
      products,
      foundProjects,
      query
    }
  }
}

export default SearchPage
