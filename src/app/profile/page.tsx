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
        <div className="flex h-screen justify-center flex-col items-center w-full border-2">
          <h1 className="">{id || "non id"}</h1>
          <h1 className="">Hello, {name || "User"}!</h1>
          <p className="">Email: {email || "email"}</p>
          <button
            onClick={() => {
              signOut();
            }}
            className="p-5 border bg-blue-500 text-white"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="">please login first</div>
      )}
    </>
  );
};

export default ProfilePage;
