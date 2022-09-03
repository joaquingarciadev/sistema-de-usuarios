import { useState } from "react";
import Head from "next/head";

export default function ForgotPassword() {
    const [formData, setFormData] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) =>
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch(process.env.NEXT_PUBLIC_URL_API + "/api/forgot-password", {
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

    return (
        <>
            <Head>
                <title>Sistema de usuarios</title>
            </Head>
            <main>
                <div className="container-md pt-5">
                    <div className="col-md-6 offset-md-3">
                        <h1>Forgot password</h1>
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
                        {successMessage && (
                            <div
                                className="alert alert-success alert-dismissible fade show"
                                role="alert"
                            >
                                {successMessage}
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
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder="Enter your email address"
                                onChange={handleChange}
                            />

                            <small id="emailHelp" className="form-text text-muted">
                                We'll never share your email with anyone else.
                            </small>

                            <button type="submit" className="btn btn-primary">
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </>
    );
}
