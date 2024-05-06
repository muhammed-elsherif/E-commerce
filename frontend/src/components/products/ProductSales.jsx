import { Badge, Container, Box, Typography } from "@mui/material";
import useProducts from "../../hooks/useProducts";
import Loader from "../Loader";

const ProductSales = () => {
  const productsQuery = useProducts();
  const products = productsQuery.data ?? [];

  const discountedProducts =
    products.length > 0
      ? products.filter((product) => product.discountPrice)
      : [];

  if (productsQuery.isLoading) {
    return (
      <div className="loader-container">
        <Loader />
      </div>
    );
  }

  if (productsQuery.isError) {
    return <div>Error: {productsQuery.error.message}</div>;
  }

  if (discountedProducts.length === 0) {
    return null;
  }

  return (
    <Container sx={{ py: 9 }}>
      <Typography variant="h6">Sales</Typography>
      <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {discountedProducts.map((product, index) => (
          <div key={index} className="flex flex-col items-center">
            <img
              alt={product.name}
              className="mb-4"
              height="300"
              src={`data:image/jpeg;base64,${product.productPictures[0]}`}
              style={{
                aspectRatio: "200/300",
                objectFit: "cover",
              }}
              width="200"
            />
            <div className="text-center">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <div className="flex items-baseline space-x-2">
                <span className="text-xl font-bold text-red-600">
                  {`EGP ${product.discountPrice}`}
                </span>
                <span className="text-sm line-through text-gray-400">
                  {`EGP ${product.price}`}
                </span>
              </div>
              <Badge className="mt-2" variant="secondary">
                SALE
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default ProductSales;
