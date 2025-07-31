"use client";

import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function Profile() {
    const router = useRouter();

    const signOut = useCallback(async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            router.push("auth/signin");
        } else {
            alert("Sign out failed: " + error.message);
        }
    }, [router]);

    return (
        <>
            <div>Welcome!</div>
            <h1>Set up your profile</h1>
            <button className="cursor-pointer" onClick={signOut}>Sign Out</button>
        </>
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