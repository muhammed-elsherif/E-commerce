import { useQuery } from "@tanstack/react-query";
import { productsApi } from "../services/api";

const useProducts = () => {
    return useQuery({
        queryKey: ["products"],
        queryFn: productsApi.getAll
    });
};

export default useProducts;