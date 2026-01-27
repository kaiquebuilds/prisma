"use client";
import { useRouter } from "next/navigation";

export function UserNotFound() {
  const { refresh } = useRouter();

  function clickHandler() {
    refresh();
  }

  return (
    <div>
      <p>User not found</p>
      <button onClick={clickHandler}>Click here to retry</button>
    </div>
  );
}
