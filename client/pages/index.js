import { useContext, useEffect, useState } from "react";
import AppContext from "../contexts/AppContext";
import Head from "next/head";
import Navbar from "../components/Navbar";

export default function Home() {
    const { user, loading } = useContext(AppContext);

    return (
        <>
            <Head>
                <title>{user ? user.username : "Sistema de usuarios"}</title>
            </Head>
            <main>
                <Navbar />
                <div className="container-md pt-3">
                    {loading ? (
                        <div className="fixed-top vh-100 d-flex justify-content-center align-items-center">
                            <div className="spinner-border" role="status"></div>
                        </div>
                    ) : user ? (
                        <>
                            <h1>Hi {user.username}!👋</h1>
                            <p>{user.email}</p>{" "}
                            <span
                                className={
                                    user.status === "inactive"
                                        ? "badge rounded-pill text-bg-secondary"
                                        : "badge rounded-pill text-bg-success"
                                }
                            >
                                {user.status}
                            </span>
                        </>
                    ) : (
                        <h1>You are not logged in</h1>
                    )}
                </div>
            </main>
        </>
    );
}
