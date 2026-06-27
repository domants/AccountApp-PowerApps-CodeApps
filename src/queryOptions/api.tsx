import { AccountsService } from '../generated';
import type { Accounts } from '../generated/models/AccountsModel';
import type { IGetAllOptions } from '../generated/models/CommonModels';

export const fetchAccounts = async () => {
  const baseOptions: IGetAllOptions = {
    select: ['accountid', 'accountnumber', 'name', 'address1_city'],
    maxPageSize: 500,
    orderBy: ['name asc'],
  };

  let allAccounts: Accounts[] = [];
  let skipToken: string | undefined = undefined;

  do {
    const result = await AccountsService.getAll({ ...baseOptions, skipToken });
    allAccounts = allAccounts.concat(result.data || []);
    skipToken = result.skipToken; //save the marker for the next fetch (undefined = no more pages)
    console.log('page size:', result.data?.length, 'skipToken:', result.skipToken);
  } while (skipToken);

  console.log('fetched total:', allAccounts.length);
  return allAccounts;
};
