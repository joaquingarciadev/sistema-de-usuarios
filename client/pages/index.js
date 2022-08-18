import { useContext, useEffect, useState } from "react";
import AppContext from "../contexts/AppContext";
import Head from "next/head";
import Navbar from "../components/Navbar";

export default function Home() {
    const { user, loading } = useContext(AppContext);

    // useEffect(() => {
    // }, []);

    return (
        <>
            <Head>
                <title>{user ? user.username : "Home"}</title>
            </Head>
            <main>
                <Navbar />
                <div className="container-md">
                    {loading ? (
                        <div className="fixed-top vh-100 d-flex justify-content-center align-items-center">
                            <div className="spinner-border" role="status"></div>
                        </div>
                    ) : user ? (
                        <>
                            <h1 className="my-4">Hi {user.username}!👋</h1>
                            <p>Email: {user.email}</p>
                            <p>Role: {user.role}</p>
                            <p>
                                Status:{" "}
                                <span
                                    className={
                                        user.status === "INACTIVE"
                                            ? "badge rounded-pill text-bg-secondary"
                                            : "badge rounded-pill text-bg-success"
                                    }
                                >
                                    {user.status}
                                </span>
                            </p>
                        </>
                    ) : (
                        <h1>You are not logged in</h1>
                    )}
                </div>
            </main>
        </>
    );
}
