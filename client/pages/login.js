import React, { useContext, useEffect, useState } from "react";
import AppContext from "../contexts/AppContext";
import Link from "next/link";
import Head from "next/head";
import Navbar from "../components/Navbar";

export default function Login() {
    const { user } = useContext(AppContext);
    const [formData, setFormData] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);

    const handleChange = (e) =>
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    useEffect(() => {
        const oauth = async () => {
            const res = await fetch(process.env.NEXT_PUBLIC_URL_API + "/api/auth/success", {
                method: "GET",
                credentials: "include",
            });
            if (res.status !== 500) {
                const data = await res.json();
                if (data.error) {
                    setErrorMessage(data.error);
                } else {
                    localStorage.setItem("token", data.token);
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
            if (remember) localStorage.setItem("refreshToken", data.refreshToken);
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

    const github = (e) => {
        e.preventDefault();
        window.open(`${process.env.NEXT_PUBLIC_URL_API}/api/auth/github`, "_self");
    };

    return (
        <>
            <Head>
                <title>Log in</title>
            </Head>
            <main>
                <Navbar />
                <div className="container-md pt-3">
                    {user ? (
                        <h1>You are logged</h1>
                    ) : (
                        <div className="col-md-4 offset-md-4">
                            <h1 className="text-center">Log in</h1>
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
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                />
                                <div className="position-relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Password"
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                    />
                                    <div
                                        className="position-absolute"
                                        style={{
                                            top: "50%",
                                            right: "10px",
                                            transform: "translateY(-50%)",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {showPassword ? (
                                            <i
                                                className="bi bi-eye"
                                                onClick={() => setShowPassword(false)}
                                            ></i>
                                        ) : (
                                            <i
                                                className="bi bi-eye-slash"
                                                onClick={() => setShowPassword(true)}
                                            ></i>
                                        )}
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="remember"
                                            onChange={(e) => setRemember(e.target.checked)}
                                            checked={remember}
                                        />
                                        <label className="form-check-label" htmlFor="remember">
                                            Remember me
                                        </label>
                                    </div>
                                    <div>
                                        <Link href="#" /* href="/forgot" */>
                                            <a>Forgot password?</a>
                                        </Link>
                                    </div>
                                </div>
                                <Link href="/signup">
                                    <a>You don't have an account? Signup</a>
                                </Link>
                                <button type="submit" className="btn btn-primary">
                                    Log in
                                </button>
                                <div className="w-100 position-relative text-center">
                                    <hr className="text-dark" />
                                    <div
                                        className="divider-content-center"
                                        style={{
                                            position: "absolute",
                                            top: "50%",
                                            left: "50%",
                                            transform: "translate(-50%, -50%)",
                                            backgroundColor: "var(--bs-body-bg)",
                                            padding: "0.5rem",
                                        }}
                                    >
                                        <span className="text-secondary">or</span>
                                    </div>
                                </div>
                                <button className="btn btn-red" onClick={google}>
                                    <i className="bi bi-google"></i>&emsp;Log in with Google
                                </button>
                                <button className="btn btn-blue" onClick={facebook}>
                                    <i className="bi bi-facebook"></i>&emsp;Log in with Facebook
                                </button>
                                <button className="btn btn-dark" onClick={github}>
                                    <i className="bi bi-github"></i>&emsp;Log in with Github
                                </button>
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
                </div>
            </main>
        </>
    );
}
