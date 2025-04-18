import { useQuery } from "@tanstack/react-query";
import { productsApi } from "../services/api";

const useProductsSearch = (searchParams) => {
  return useQuery({
    queryKey: ["search-products", searchParams],
    queryFn: () => productsApi.search(searchParams),
    enabled: !!searchParams, // Only enable the query when searchParams is truthy
  });
};

export default useProductsSearch;