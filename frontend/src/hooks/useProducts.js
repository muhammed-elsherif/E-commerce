import { useQuery } from "@tanstack/react-query";

const fetchAllProducts = async () => {
  const response = await fetch("http://localhost:4000/products", {
    method: "GET",
  });
  const result = await response.json();
  return result;
};

const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchAllProducts,
  });
};

export default useProducts;