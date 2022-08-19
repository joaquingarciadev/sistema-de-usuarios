import React, { useState } from "react";
import Head from "next/head";
import Navbar from "../components/Navbar";

export default function Signup() {
    const [formData, setFormData] = useState({});
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch(process.env.NEXT_PUBLIC_URL_API + "/api/signup", {
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
            window.location.href = "/login";
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
                <title>Sign up</title>
            </Head>
            <main>
                <Navbar />
                <div className="container-md">
                    <div className="col-md-4 offset-md-4">
                        <h1 className="text-center">Sign up</h1>
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
                                type="email"
                                name="email"
                                placeholder="Email"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
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
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="terms"
                                    required
                                />
                                <label className="form-check-label" htmlFor="terms">
                                    I accept the <a href="#">terms and conditions</a>
                                </label>
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Sign up
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
                                <i className="bi bi-google"></i>&emsp;Sign up with Google
                            </button>
                            <button className="btn btn-blue" onClick={facebook}>
                                <i className="bi bi-facebook"></i>&emsp;Sign up with Facebook
                            </button>
                            <button className="btn btn-dark" onClick={github}>
                                <i className="bi bi-github"></i>&emsp;Sign up with Github
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </>
    );
}
