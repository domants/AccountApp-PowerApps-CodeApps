import { queryOptions } from "@tanstack/react-query";

import { AccountsService } from "../generated/services/AccountsService"; //service methods for interacting within account table
import type { IGetAllOptions } from "../generated/models/CommonModels";

const fetchAccounts = async () => {
  const options: IGetAllOptions = {
    select: ["accountid", "accountnumber", "name", "address1_city"],
    top: 1000,
    orderBy: ["name asc"],
  };
  const result = await AccountsService.getAll(options);
  return result.data || [];
};

export const fetchAccountQueryOptions = () => {
  return queryOptions({ queryKey: ["account"], queryFn: fetchAccounts });
};
