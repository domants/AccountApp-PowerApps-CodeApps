import { AccountsService } from "../generated/services/AccountsService"; //service methods for interacting within account table
import type { AccountsBase } from "../generated/models/AccountsModel"; //defines data model for account table
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAccountQueryOptions } from "../queryOptions/fetchAccountQueryOptions";

//=== CREATE ===
export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    //The type (Partial<AccountsBase>) = what typescript allowed to pass.
    mutationFn: (newAccount: Partial<AccountsBase>) =>
      AccountsService.create(newAccount as Omit<AccountsBase, "accountid">), //Omit<TypeAllowed, KeysToRemove>

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: fetchAccountQueryOptions().queryKey,
      }); //Mutate the server - then invalidate the cache that's now stale/old
    },
  });
};
//=== END OF CREATE ===

//DELETE
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => AccountsService.delete(id),

    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: fetchAccountQueryOptions().queryKey,
      }),
  });
};
