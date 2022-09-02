import React, { useState } from "react";
import Head from "next/head";

export default function Signup() {
    const [formData, setFormData] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) =>
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    const verifyField = (value, type) => {
        if (!value) return true;

        if (type === "username") return /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/gim.test(value);
        /* 
        - Usernames can contain characters a-z, 0-9, underscores and periods. 
        - The username cannot start with a period nor end with a period. 
        - It must also not have more than one period sequentially. 
        - Max length is 30 chars.
        */
        if (type === "password")
            return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm.test(value);
        /* 
        - At least 8 characters
        - Must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number
        - Can contain special characters 
        */
        if (type === "email")
            return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g.test(
                value
            );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !(
                verifyField(formData.username, "username") &&
                verifyField(formData.password, "password") &&
                verifyField(formData.email, "email")
            )
        )
            return;

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
            setSuccessMessage("");
        } else {
            setSuccessMessage("Please verify your email address");
            setErrorMessage("");
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
                <div className="container-md pt-3">
                    <div className="col-md-4 offset-md-4">
                        <h1 className="text-center">Sign up</h1>
                        {errorMessage && (
                            <div className="alert alert-danger" role="alert">
                                {errorMessage}
                            </div>
                        )}
                        {successMessage && (
                            <div className="alert alert-success" role="alert">
                                {successMessage}
                            </div>
                        )}
                        <form className="d-grid gap-3" onSubmit={handleSubmit}>
                            <div>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    onChange={handleChange}
                                    className={`form-control ${
                                        !(formData.username && formData.username.length)
                                            ? ""
                                            : verifyField(formData.username, "username")
                                            ? "is-valid"
                                            : "is-invalid"
                                    }`}
                                    required
                                />
                                {!verifyField(formData.username, "username") && (
                                    <div className="invalid-feedback">
                                        Please provide a valid username.
                                    </div>
                                )}
                            </div>
                            <div>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    onChange={handleChange}
                                    className={`form-control ${
                                        !(formData.email && formData.email.length)
                                            ? ""
                                            : verifyField(formData.email, "email")
                                            ? "is-valid"
                                            : "is-invalid"
                                    }`}
                                    required
                                />
                                {!verifyField(formData.email, "email") && (
                                    <div className="invalid-feedback">
                                        Please provide a valid email.
                                    </div>
                                )}
                            </div>
                            <div>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    onChange={handleChange}
                                    className={`form-control ${
                                        !(formData.password && formData.password.length)
                                            ? ""
                                            : verifyField(formData.password, "password")
                                            ? "is-valid"
                                            : "is-invalid"
                                    }`}
                                    required
                                />
                                {!verifyField(formData.password, "password") && (
                                    <div className="invalid-feedback">
                                        Please provide a valid password. <br />
                                        - At least 8 characters <br />
                                        - Must contain at least 1 uppercase letter, 1 lowercase
                                        letter, and 1 number <br />- Can contain special characters
                                    </div>
                                )}
                            </div>
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
