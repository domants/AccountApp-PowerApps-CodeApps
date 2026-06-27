import { queryOptions } from '@tanstack/react-query';
import { fetchAccounts } from './api';

export const fetchAccountQueryOptions = () => {
  return queryOptions({
    queryKey: ['account'],
    queryFn: fetchAccounts,
    refetchOnWindowFocus: false, //the query will not refetch on window focus
    //staleTime: 1000 * 60 * 5, // treat data as fresh for 5 min — no refetch on remount
    //gcTime: 1000 * 60 * 30, // keep cached data 30 min even when no component uses it
  });
};
