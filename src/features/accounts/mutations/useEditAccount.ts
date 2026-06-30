import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAccountQueryOptions } from '../queryOptions/fetchAccountQueryOptions';
import { AccountsService } from '../../../generated';
import type { AccountsBase } from '../../../generated/models/AccountsModel';

type EditAccountVars = {
  id: string;
  changes: Partial<Omit<AccountsBase, 'accountid'>>;
};

export const useEditAccount = () => {
  const queryClient = useQueryClient();
  const queryKey = fetchAccountQueryOptions().queryKey;

  return useMutation({
    mutationFn: ({ id, changes }: EditAccountVars) => AccountsService.update(id, changes), //server updater

    onSuccess: (_data, { id, changes }) => {
      // replace the matching row locally with its updated fields
      queryClient.setQueryData(queryKey, (old = []) =>
        old.map((acc) => (acc.accountid === id ? { ...acc, ...changes } : acc)),
      );
    },

    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });
};
