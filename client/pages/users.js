import { useContext, useState } from "react";
import AppContext from "../contexts/AppContext";
import Head from "next/head";
import Navbar from "../components/Navbar";
import Table from "../components/Table";

export default function Users() {
    const { user, loading } = useContext(AppContext);

    return (
        <>
            <Head>
                <title>Sistema de usuarios</title>
            </Head>
            <main>
                <Navbar />
                <div className="container-md pt-3">
                    {loading ? (
                        <div className="fixed-top vh-100 d-flex justify-content-center align-items-center">
                            <div className="spinner-border" role="status"></div>
                        </div>
                    ) : user ? (
                        <>{user.role === "admin" && <Table />}</>
                    ) : (
                        <h1>You are not logged in</h1>
                    )}
                </div>
            </main>
        </>
    );
}
