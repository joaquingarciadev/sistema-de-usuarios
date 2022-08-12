import { useEffect, useState } from "react";
import AppContext from "../contexts/AppContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/style.scss";

function MyApp({ Component, pageProps }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        import("bootstrap/dist/js/bootstrap");
    }, []);

    useEffect(() => {
        const getUser = async () => {
            setLoading(true);
            const res = await fetch(process.env.NEXT_PUBLIC_URL_API + "/api/user/me", {
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
        if (user && user.status === "INACTIVE") {
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
