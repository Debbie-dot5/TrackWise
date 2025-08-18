"use client";

// import { supabase } from "@/utils/supabaseClient";
// import { useRouter } from "next/navigation";
// import { useCallback } from "react";
import Image from "next/image";
import { ArrowBigRight } from "lucide-react";
import Link from "next/link";

export default function WelcomePage() {
    // const router = useRouter();

    // const signOut = useCallback(async () => {
    //     const { error } = await supabase.auth.signOut();
    //     if (!error) {
    //         router.push("auth/signin");
    //     } else {
    //         alert("Sign out failed: " + error.message);
    //     }
    // }, [router]);

    return (
        <div className="mx-auto mt-20  items-center text-center flex flex-col">
            <Image
                src="/illustrations/c1.svg"
                alt="Welcome Image"
                width={300}
                height={300}
                quality={100}
                className="mb-6"
            />
            <div className="text-2xl font-bold mb-4 ">Welcome!</div>

          <Link href="/setup-profile" className="text-lg  hover:underline mb-4">
            <h1 className="cursor-pointer px-6 md:px-0">Let&#39;s get you set up to track your expenses like a pro.
                <ArrowBigRight className="inline-block ml-2" />
            </h1>
          </Link>
          


            {/* <button className="cursor-pointer" onClick={signOut}>Sign Out</button> */}
        </div>
    );
}

// import { supabase } from "@/utils/supabaseClient";



// export default function Profile() {

//       const signOut = async () => {
//         const { error } = await supabase.auth.signOut();
//     };

//     return (
//         <>
//         <div>Welcome! </div>
//         <h1>Set up your profile</h1>
        
//         <button onClick={signOut}>SignOut</button>

//         </>
//     )
// }