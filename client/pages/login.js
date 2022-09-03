import React, { useContext, useEffect, useState } from "react";
import AppContext from "../contexts/AppContext";
import Link from "next/link";
import Head from "next/head";

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
                <title>Sistema de usuarios</title>
            </Head>
            <main>
                <div className="container-md pt-5">
                    {user ? (
                        <h1>You are logged</h1>
                    ) : (
                        <div className="col-md-6 offset-md-3">
                            <h1>Log in</h1>
                            <div
                                className="alert alert-success alert-dismissible fade show"
                                role="alert"
                            >
                                <div>
                                    <strong>Example</strong>
                                    <br />
                                    Username: admin
                                    <br />
                                    Password: admin
                                </div>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="alert"
                                    aria-label="Close"
                                ></button>
                            </div>
                            {errorMessage && (
                                <div
                                    className="alert alert-danger alert-dismissible fade show"
                                    role="alert"
                                >
                                    {errorMessage}
                                    <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="alert"
                                        aria-label="Close"
                                    ></button>
                                </div>
                            )}
                            <form className="d-grid gap-3" onSubmit={handleSubmit}>
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
                                            transform: "translateY(-50%)",
                                            right: "16px",
                                            fontSize: "16px",
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
                                        <Link href="/forgot-password">
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
                            </form>
                            <br />
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
