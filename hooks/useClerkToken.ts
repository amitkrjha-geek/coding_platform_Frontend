// import { useAuth } from "@clerk/nextjs";
// import { useState, useEffect } from "react";
// import { setToken as setLocalToken, getToken as getLocalToken, removeToken as removeLocalToken } from "@/config/token";

// export const useClerkToken = () => {
//   const { getToken, isSignedIn } = useAuth();
//   const [token, setTokenState] = useState<string | null>(getLocalToken());
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchToken = async () => {
//       try {
//         if (isSignedIn) {
//           const jwt = await getToken();
//           console.log("Clerk JWT Token:", jwt);
//           if (jwt) {
//             setTokenState(jwt);
//             setLocalToken(jwt);
//           }
//         } else {
//           setTokenState(null);
//           removeLocalToken();
//         }
//       } catch (error) {
//         console.error('Error fetching token:', error);
//         setTokenState(null);
//         removeLocalToken();
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchToken();
//   }, [isSignedIn, getToken]);

//   return { token, isLoading };
// }; 