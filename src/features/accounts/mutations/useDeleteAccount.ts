import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAccountQueryOptions } from '../queryOptions/fetchAccountQueryOptions';
import { AccountsService } from '../../../generated';

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  const queryKey = fetchAccountQueryOptions().queryKey;

  return useMutation({
    mutationFn: (id: string) => AccountsService.delete(id), //server updater
    onSuccess: (_data, id) => {
      queryClient.setQueryData(
        queryKey,
        (old = []) => old.filter((oldAcc) => oldAcc.accountid !== id), // remove the row locally — instant, no server read needed
      );
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }), //Mutate the server - then invalidate the cache that's now stale/old then refetch for new data
  });
};
