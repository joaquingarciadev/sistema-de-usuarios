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

    return (
        <>
            <Head>
                <title>Signup</title>
            </Head>
            <main>
                <Navbar />
                <div className="col-md-4 offset-md-4 px-3 mt-5">
                    <h1>Signup</h1>
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
                            Signup
                        </button>
                        {errorMessage && (
                            <div className="alert alert-danger" role="alert">
                                {errorMessage}
                            </div>
                        )}
                    </form>
                </div>
            </main>
        </>
    );
}
