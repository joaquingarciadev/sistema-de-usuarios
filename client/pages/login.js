import React, { useContext, useEffect, useState } from "react";
import AppContext from "../contexts/AppContext";
import Link from "next/link";
import Head from "next/head";
import Navbar from "../components/Navbar";

export default function Login() {
    const { user } = useContext(AppContext);
    const [formData, setFormData] = useState({});
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const oauth = async () => {
            const res = await fetch(process.env.NEXT_PUBLIC_URL_API + "/api/auth/success", {
                method: "GET",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true,
                },
            });
            if (res.status !== 500) {
                const data = await res.json();
                if (data.error) {
                    setErrorMessage(data.error);
                } else {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("refreshToken", data.refreshToken);
                    window.location.href = "/";
                }
            }
        };
        if (!localStorage.getItem("token")) oauth();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch(process.env.NEXT_PUBLIC_URL_API + "/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.error) {
            setErrorMessage(data.error);
        } else {
            localStorage.setItem("token", data.token);
            localStorage.setItem("refreshToken", data.refreshToken);
            window.location.href = "/";
        }
    };

    const google = (e) => {
        e.preventDefault();
        window.open(`${process.env.NEXT_PUBLIC_URL_API}/api/auth/google`, "_self");
    };

    const facebook = (e) => {
        e.preventDefault();
        window.open(`${process.env.NEXT_PUBLIC_URL_API}/api/auth/facebook`, "_self");
    };

    return (
        <>
            <Head>
                <title>Login</title>
            </Head>
            <main>
                <Navbar />
                {user ? (
                    <div className="container">
                        <h1>You are logged</h1>
                    </div>
                ) : (
                    <div className="col-md-4 offset-md-4 px-3 mt-5">
                        <h1>Login</h1>
                        {errorMessage && (
                            <div className="alert alert-danger" role="alert">
                                {errorMessage}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="d-grid gap-3">
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        username: e.target.value,
                                    })
                                }
                                className="form-control"
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        password: e.target.value,
                                    })
                                }
                                className="form-control"
                                required
                            />
                            <Link href="/signup">
                                <a>You don't have an account? Signup</a>
                            </Link>
                            <button type="submit" className="btn btn-primary">
                                Login
                            </button>
                            <hr />
                            <button className="btn btn-red" onClick={google}>
                                <i className="bi bi-google"></i> Login with Google
                            </button>
                            {/* <button className="btn btn-blue" onClick={facebook}>
                                Login with Facebook
                            </button> */}
                            <div className="alert alert-success" role="alert">
                                <strong>Example</strong>
                                <br />
                                Username: admin
                                <br />
                                Password: admin
                            </div>
                        </form>
                    </div>
                )}
            </main>
        </>
    );
}
