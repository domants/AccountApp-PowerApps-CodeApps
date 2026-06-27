import { useQuery } from '@tanstack/react-query';
import { fetchAccountQueryOptions } from '../queryOptions/fetchAccountQueryOptions';
import { useState } from 'react';
import { useDeleteAccount } from '../mutations/useDeleteAccount';

function AccountList() {
  const { data: accounts, isPending } = useQuery(fetchAccountQueryOptions()); //get data in server side
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredAccount = accounts?.filter((account) =>
    account.name?.toLowerCase().includes(searchTerm?.toLowerCase()),
  );

  //call delete hook
  const deleteAccount = useDeleteAccount();

  const handleDelete = (accountId: string) => {
    deleteAccount.mutate(accountId, {
      onSuccess: (data) => {
        console.log(`account deleted: ${JSON.stringify(data)}`);
      },
      onError: (error) => {
        console.error(`There was an error deleting the account ${error}`);
      },
      onSettled: (data) => console.log(`Deleted! ${JSON.stringify(data)}`),
    });
  };

  return (
    <>
      <h1 className="flex flex-col items-center gap-2">
        <input
          className="border-2"
          type="text"
          placeholder="search account..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {isPending ? (
          <p>Loading...</p>
        ) : (
          filteredAccount?.map((account) => (
            <div key={account.accountid} className="flex gap-2">
              {account.name}

              <button
                className="border-2 cursor-pointer"
                onClick={() => handleDelete(account.accountid)}
              >
                Delete Account
              </button>
            </div>
          ))
        )}
      </h1>
    </>
  );
}

export default AccountList;
