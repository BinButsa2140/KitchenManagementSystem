"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const { name, email, id } = session?.user || {};
  const router = useRouter()

  useEffect(()=>{
    if(status == 'unauthenticated'){
      router.push('/signin')
    }
  }, [])

  console.log(status);
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return router.push('/signin')
  }
  return (
    <>
      {session ? (
        <div className="flex min-h-screen justify-center flex-col items-center w-full border-2 p-4 sm:p-8">
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 w-full max-w-md">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">ID: {id || "non id"}</h1>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Hello, {name || "User"}!</h1>
            <p className="text-sm sm:text-base text-gray-600 mb-6">Email: {email || "email"}</p>
            <button
              onClick={() => {
                signOut();
              }}
              className="w-full p-3 sm:p-4 border bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="">please login first</div>
      )}
    </>
  );
};

export default ProfilePage;
