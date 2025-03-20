// pages/_app.js
import 'bootstrap/dist/css/bootstrap.min.css';  // Import Bootstrap CSS

import { useRouter } from "next/router";
import { useEffect } from "react";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const path = router.pathname;

    // If the user is not logged in and tries to access private pages
    if (!token && (path !== "/login" && path !== "/register")) {
      router.push("/login"); // Redirect to login
    }

    // If the user is logged in, prevent access to login or register pages
    if (token && (path === "/login" || path === "/register")) {
      router.push("/"); // Redirect to home if already logged in
    }
  }, [router]);

  return <Component {...pageProps} />;
}
