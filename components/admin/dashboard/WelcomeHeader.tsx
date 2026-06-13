"use client";

import useCurrentUser from "@/hooks/useCurrentUser";
import React from "react";

const WelcomeHeader = () => {
  const { user } = useCurrentUser();
  const splitterUserName = user?.name?.split(" ") || [];
  return (
    <header className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
          Welcome back,{" "}
          {`${splitterUserName[0]} ${splitterUserName[1]}` || "User"}
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Here&apos;s what&apos;s happening across PBA Royal Ambassadors today.
        </p>
      </div>
      <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
        {new Date().toLocaleDateString("en-NG", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>
    </header>
  );
};

export default WelcomeHeader;
