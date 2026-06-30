import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { MoreHorizontalIcon } from 'lucide-react';

import { fetchAccountQueryOptions } from '../queryOptions/fetchAccountQueryOptions';
import { useDeleteAccount } from '../mutations/useDeleteAccount';
import { EditAccount } from './EditAccount';
import type { Accounts } from '../../../generated/models/AccountsModel';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const PAGE_SIZE = 15;

function AccountList() {
  const { data: accounts, isPending } = useQuery(fetchAccountQueryOptions());
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [editingAccount, setEditingAccount] = useState<Accounts | null>(null);

  const deleteAccount = useDeleteAccount();
  const handleDelete = (id: string) => {
    deleteAccount.mutate(id, {
      onError: (error) => console.error(`Error deleting: ${error}`),
    });
  };

  //FILTER
  const filtered =
    accounts?.filter((a) => a.name?.toLowerCase().includes(searchTerm.toLowerCase())) ?? [];

  //PAGE SLICER
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const pageRows = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <>
      <div className="flex flex-col items-center gap-2">
        <input
          className="border-2"
          type="text"
          placeholder="search account..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0); //reset to first page when searching
          }}
        />
      </div>

      <div className="mx-auto flex w-full flex-col">
        <div className="overflow-hidden rounded-2xl border">
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
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                pageRows.map((account) => (
                  <TableRow key={account.accountid}>
                    <TableCell className="font-medium">{account.accountnumber}</TableCell>
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
                          <DropdownMenuItem onClick={() => setEditingAccount(account)}>
                            Edit
                          </DropdownMenuItem>
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
        </div>

        {/* pagination buttons */}
        <div className="flex items-center justify-end space-x-2 py-4">
          <span className="text-muted-foreground mr-auto text-sm">
            Page {pageCount === 0 ? 0 : page + 1} of {pageCount}
          </span>

          {/* PREVIOUS */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 0}
          >
            Previous
          </Button>

          {/* NEXT */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= pageCount - 1}
          >
            Next
          </Button>
        </div>
      </div>

      {editingAccount && (
        <EditAccount
          account={editingAccount}
          open={!!editingAccount}
          onOpenChange={(open) => !open && setEditingAccount(null)}
        />
      )}
    </>
  );
}

export default AccountList;
