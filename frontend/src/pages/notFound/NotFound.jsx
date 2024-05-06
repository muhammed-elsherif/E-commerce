/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import lock from "../../images/lock.svg";
import { Box } from "@mui/material";

const NotFound = () => {
  return (
    <Box >
      <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <img className="mx-auto" height="112" src={lock} width="112" alt="" />
          {/* <p className="text-base font-semibold text-indigo-600">404</p> */}
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Page not found
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-600 whitespace-pre-line">
            When this happens, it's usually because the owner only shared it
            with a small group of people, changed who can see it or it's been
            deleted.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="/"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Go back home
            </a>
            <a href="#" className="text-sm font-semibold text-gray-900">
              Contact support <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </main>
    </Box>
  );
};

export default NotFound;
