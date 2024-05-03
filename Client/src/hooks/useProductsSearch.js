import { useQuery } from "@tanstack/react-query";

const fetchProductsBySearch = async (searchParams) => {
  const response = await fetch(`http://localhost:4000/search/${searchParams}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const result = await response.json();
  return result;
};

const useProductsSearch = (searchParams) => {
  return useQuery({
    queryKey: ["search-products", searchParams],
    queryFn: () => fetchProductsBySearch(searchParams),
    enabled: !!searchParams, // Only enable the query when searchParams is truthy
  });
};

export default useProductsSearch;