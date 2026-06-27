import { useState } from 'react';
import { useCreateAccount } from '../../../mutations/useAccountMutations';

function CreateAccount() {
  const [name, setName] = useState<string>('');
  const [accountnumber, setAccountNumber] = useState<string>('');
  const createAccount = useCreateAccount();

  const handleCreate = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) return;

    createAccount.mutate(
      { name, accountnumber }, //arg 1: variables (the data to send)
      {
        //arg 2: options (callbacks for this specific call)
        onSuccess: (data) => {
          //console.log(`Account Created: ${result?.data?.name}`);
          console.log(`New ID: ${data?.data?.accountid}`);

          setName('');
          setAccountNumber('');
        },
        onError: (error) => {
          console.error(`Created failed ${error.message}`);
        },
      },
    );
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <form onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Account Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Account Number"
          value={accountnumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />
        <button>Create</button>
      </form>

      {createAccount.isError && (
        <p className="text-red-600">Failed to create account. Please try again.</p>
      )}
    </div>
  );
}

export default CreateAccount;
