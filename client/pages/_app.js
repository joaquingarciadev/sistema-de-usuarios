import { useEffect, useState } from "react";
import AppContext from "../contexts/AppContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/style.scss";
import googleOneTap from "google-one-tap";

function MyApp({ Component, pageProps }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        typeof document !== undefined ? require("bootstrap/dist/js/bootstrap") : null;
    }, []);

    // Google One Tap
    const options = {
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID, // required
        auto_select: false, // optional
        cancel_on_tap_outside: false, // optional
        context: "signin", // optional
    };

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            googleOneTap(options, async (response) => {
                // Send response to server
                const res = await fetch(
                    process.env.NEXT_PUBLIC_URL_API + "/api/auth/google/onetap",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(response),
                    }
                );
                if (res.status !== 500) {
                    const data = await res.json();
                    localStorage.setItem("token", data.token);
                    window.location.reload();
                }
            });
        }
    }, []);

    // Get user
    useEffect(() => {
        const getUser = async () => {
            setLoading(true);
            const res = await fetch(process.env.NEXT_PUBLIC_URL_API + "/api/account", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (res.status === 200) {
                const data = await res.json();
                setUser(data.user);
            } else if (res.status === 401) {
                const res = await fetch(process.env.NEXT_PUBLIC_URL_API + "/api/refresh-token", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
                    },
                });
                if (res.status === 200) {
                    const data = await res.json();
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("refreshToken", data.refreshToken);
                    getUser();
                }
            } else {
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                window.location.reload();
            }
            setLoading(false);
        };

        if (localStorage.getItem("token")) getUser();
    }, []);

    useEffect(() => {
        if (user && user.status === "inactive") {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            setUser(null);
        }
    }, [user]);

    return (
        <AppContext.Provider value={{ user, setUser, loading, setLoading }}>
            <Component {...pageProps} />{" "}
        </AppContext.Provider>
    );
}

export default MyApp;
