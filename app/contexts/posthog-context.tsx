import posthog from "posthog-js";
import { useEffect, createContext, useContext, useRef } from "react";

type PosthogType = typeof posthog | undefined;

const PosthogContext = createContext<PosthogType>(undefined);

interface PosthogProviderProps {
  children: React.ReactNode;
}

// export function PosthogProvider({ children }: PosthogProviderProps) {
//   const posthogInstanceRef = useRef<PosthogType>(undefined);

//   useEffect(() => {

//     // Only initialize PostHog once during component mount
//     if (posthogInstanceRef.current) return;
    
//     const apiKey = window.ENV?.POSTHOG_API_KEY;
//     if (!apiKey) return;

//     posthogInstanceRef.current = posthog.init(apiKey, {
//       api_host: "https://us.i.posthog.com",
//       loaded: (posthog) => {
//         if (process.env.NODE_ENV === 'development') {
//           posthog.debug();
//         }
//       },
//     });
//   }, []);

//   return (
//     <PosthogContext.Provider value={posthogInstanceRef.current}>
//       {children}
//     </PosthogContext.Provider>
//   );
// }


/*
 * We need this file because posthog-js is missing an exports property that
 * allows the library to be used with Remix Vite.
 * https://github.com/PostHog/posthog-js/issues/908
 */
export function PosthogProvider({ children }: PosthogProviderProps) {
  const posthogInstanceRef = useRef<PosthogType>(undefined);

  // https://react.dev/reference/react/useRef#avoiding-recreating-the-ref-contents
  // Note that in StrictMode, this will run twice.
  function getPosthogInstance() {
    if (posthogInstanceRef.current) return posthogInstanceRef.current;
    if (!window.ENV.POSTHOG_API_KEY) return undefined;

    posthogInstanceRef.current = posthog.init(window.ENV.POSTHOG_API_KEY, {
      api_host: "https://us.i.posthog.com",
    });
    return posthogInstanceRef.current;
  }

  return (
    <PosthogContext.Provider value={getPosthogInstance()}>
      {children}
    </PosthogContext.Provider>
  );
}

export const usePosthog = () => useContext(PosthogContext);