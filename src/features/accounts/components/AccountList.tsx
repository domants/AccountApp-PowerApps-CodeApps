import { MoreHorizontalIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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
      </h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Account Number</TableHead>
            <TableHead>Account Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending ? (
            <p>Loading...</p>
          ) : (
            filteredAccount?.map((account) => (
              <TableRow>
                <TableCell key={account.accountid} className="font-medium">
                  {account.accountnumber}
                </TableCell>
                <TableCell>{account.name}</TableCell>
                <TableCell>{account.address1_city}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontalIcon />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => handleDelete(account.accountid)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
}

export default AccountList;
