// The useQuery hook provides the data, isLoading, and error properties, which allow you to handle different states of the query.
import { useQuery } from '@tanstack/react-query';

const fetchBreedList = async ({ queryKey }) => {
  const [, animal] = queryKey;

  if (!animal) return [];

  const res = await fetch(
    `http://pets-v2.dev-apis.com/breeds?animal=${animal}`
  );
  return res.json();
};

const useBreedList = (animal) => {
  return useQuery(['breeds', animal], fetchBreedList);
};

export default useBreedList;
