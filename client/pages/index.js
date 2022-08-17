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
                            <h1>Hi {user.username}!👋</h1>
                            <p>Role: {user.role}</p>
                            <p>Status: {user.status}</p>
                        </>
                    ) : (
                        <h1>You are not logged in</h1>
                    )}
                </div>
            </main>
        </>
    );
}
