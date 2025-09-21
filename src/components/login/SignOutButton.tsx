import { signOut } from 'next-auth/react';

export default function SignOutButton() {
  return (
    <form
      action={async () => {
        'use server';
        await signOut();
      }}
    >
      <button type="submit">Log Out</button>
    </form>
  );
}
