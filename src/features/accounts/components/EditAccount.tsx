'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { useMediaQuery } from '../../../hooks/use-media-query';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import type { Accounts } from '../../../generated/models/AccountsModel';
import { useEditAccount } from '../mutations/useEditAccount';

type EditAccountProps = {
  account: Accounts;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditAccount({ account, open, onOpenChange }: EditAccountProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Edit account</DialogTitle>
            <DialogDescription>
              Make changes to the account here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <AccountForm account={account} onDone={() => onOpenChange(false)} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit account</DrawerTitle>
          <DrawerDescription>
            Make changes to the account here. Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>
        <AccountForm account={account} onDone={() => onOpenChange(false)} className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

type AccountFormProps = {
  account: Accounts;
  onDone: () => void;
  className?: string;
};

function AccountForm({ account, onDone, className }: AccountFormProps) {
  const editAccount = useEditAccount();

  const [name, setName] = React.useState(account.name ?? '');
  const [accountnumber, setAccountNumber] = React.useState(account.accountnumber ?? '');
  const [city, setCity] = React.useState(account.address1_city ?? '');

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    editAccount.mutate(
      {
        id: account.accountid,
        changes: { name, accountnumber, address1_city: city },
      },
      {
        onSuccess: () => onDone(),
        onError: (error) => console.error(`Edit failed: ${error.message}`),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className={cn('grid items-start gap-6', className)}>
      <div className="grid gap-3">
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="accountnumber">Account Number</Label>
        <Input
          id="accountnumber"
          value={accountnumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="city">City</Label>
        <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
      </div>
      <Button type="submit" disabled={editAccount.isPending}>
        {editAccount.isPending ? 'Saving...' : 'Save changes'}
      </Button>
    </form>
  );
}
