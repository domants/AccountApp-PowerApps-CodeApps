import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAccountQueryOptions } from '../queryOptions/fetchAccountQueryOptions';
import { AccountsService } from '../../../generated';
import type { AccountsBase } from '../../../generated/models/AccountsModel';

export const useCreateAccount = () => {
  const queryClient = useQueryClient();
  const queryKey = fetchAccountQueryOptions().queryKey;

  return useMutation({
    mutationFn: (
      newAccount: Partial<AccountsBase>, //type (Partial<AccountsBase>) = what typescript allowed to pass.
    ) => AccountsService.create(newAccount as Omit<AccountsBase, 'accountid'>), //Omit<TypeAllowed, KeysToRemove>

    onSuccess: (data) => {
      if (data.data) queryClient.setQueryData(queryKey, (old = []) => [...old, data?.data]);
    },

    onSettled: () => queryClient.invalidateQueries({ queryKey }), //Mutate the server - then invalidate the cache that's now stale/old then refetch for new data
  });
};
