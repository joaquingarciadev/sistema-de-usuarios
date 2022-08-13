import { useContext, useState } from "react";
import AppContext from "../contexts/AppContext";
import Head from "next/head";
import Navbar from "../components/Navbar";
import TableUsers from "../components/TableUsers";

export default function Users() {
    const { user, loading } = useContext(AppContext);

    return (
        <>
            <Head>
                <title>Users</title>
            </Head>
            <main>
                <Navbar />
                <div className="container p-2">
                    {loading ? (
                        <div className="fixed-top vh-100 d-flex justify-content-center align-items-center">
                            <div className="spinner-border" role="status"></div>
                        </div>
                    ) : user ? (
                        <>{user.role === "ADMIN" && <TableUsers />}</>
                    ) : (
                        <h1>You are not logged in</h1>
                    )}
                </div>
            </main>
        </>
    );
}
