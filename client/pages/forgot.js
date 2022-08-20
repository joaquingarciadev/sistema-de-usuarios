import { useContext, useEffect, useState } from "react";
import Head from "next/head";
import Navbar from "../components/Navbar";

export default function Forgot() {
    return (
        <>
            <Head>
                <title>Forgot</title>
            </Head>
            <main>
                <Navbar />
                <div className="container-md">
                    <h1>Forgot</h1>
                    <form>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="Enter email"
                            />

                            <small id="emailHelp" className="form-text text-muted">
                                We'll never share your email with anyone else.
                            </small>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
}
