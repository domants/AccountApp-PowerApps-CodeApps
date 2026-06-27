import { AccountsService } from '../generated/services/AccountsService'; //service methods for interacting within account table
import type { AccountsBase } from '../generated/models/AccountsModel'; //defines data model for account table
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAccountQueryOptions } from '../queryOptions/fetchAccountQueryOptions';

//=== CREATE ===
export const useCreateAccount = () => {
  const queryClient = useQueryClient();
  const queryKey = fetchAccountQueryOptions().queryKey;
  return useMutation({
    //The type (Partial<AccountsBase>) = what typescript allowed to pass.
    mutationFn: (newAccount: Partial<AccountsBase>) =>
      AccountsService.create(newAccount as Omit<AccountsBase, 'accountid'>), //Omit<TypeAllowed, KeysToRemove>

    onSuccess: (data) => {
      if (data?.data) queryClient.setQueryData(queryKey, (old = []) => [...old, data?.data]);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }), //Mutate the server - then invalidate the cache that's now stale/old then refetch for new data
  });
};
//=== END OF CREATE ===

//DELETE
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  const queryKey = fetchAccountQueryOptions().queryKey;

  return useMutation({
    mutationFn: (id: string) => AccountsService.delete(id),
    onSuccess: (_data, id) => {
      queryClient.setQueryData(queryKey, (old = []) => old.filter((a) => a.accountid !== id)); // remove the row locally — instant, no server read needed
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }), //Mutate the server - then invalidate the cache that's now stale/old then refetch for new data
  });
};
