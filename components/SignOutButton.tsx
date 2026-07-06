"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      style={{ border: "1px solid #d8cab2", background: "#fffdf8", color: "#161616", borderRadius: 999, padding: "11px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
    >
      Sign out
    </button>
  );
}
