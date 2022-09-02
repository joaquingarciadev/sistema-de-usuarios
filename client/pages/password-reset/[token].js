import { useState } from "react";

export default function PasswordReset({ data, token }) {
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

        if (!verifyField(formData.email, "email")) return;

        const res = await fetch(process.env.NEXT_PUBLIC_URL_API + "/api/reset/" + token, {
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
            setSuccessMessage("Password changed successfully");
            setErrorMessage("");
        }
    };

    return (
        <>
            <div className="container-md pt-3">
                <h1>Reset password</h1>
                {!data ? (
                    <div className="fixed-top vh-100 d-flex justify-content-center align-items-center">
                        <div className="spinner-border" role="status"></div>
                    </div>
                ) : (
                    <>
                        {data.error ? (
                            <div className={"alert alert-danger"} role="alert">
                                {data.error}
                            </div>
                        ) : (
                            <>
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
                                    <input
                                        type="password"
                                        name="password"
                                        className="form-control"
                                        placeholder="Enter your new password"
                                        onChange={handleChange}
                                    />
                                    <button className="btn btn-primary">Submit</button>
                                </form>
                            </>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

export async function getServerSideProps(context) {
    const { token } = context.params;
    const res = await fetch(process.env.NEXT_PUBLIC_URL_API + "/api/reset/" + token);
    const data = await res.json();

    return { props: { data, token } };
}
