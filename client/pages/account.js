import { useContext, useEffect, useState } from "react";
import AppContext from "../contexts/AppContext";
import Head from "next/head";
import Navbar from "../components/Navbar";
import Modal from "react-bootstrap/Modal";

export default function Settings() {
    const { user, loading } = useContext(AppContext);
    const [formData, setFormData] = useState({});
    const [errorUpdate, setErrorUpdate] = useState("");
    const [errorDelete, setErrorDelete] = useState("");

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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

    const handleUpdateUser = async (e) => {
        e.preventDefault();

        if (
            !(
                verifyField(formData.username, "username") &&
                verifyField(formData.password, "password") &&
                verifyField(formData.email, "email")
            )
        )
            return;

        const newFormData = new FormData();
        for (const key in formData) {
            newFormData.append(key, formData[key]);
        }

        const res = await fetch(process.env.NEXT_PUBLIC_URL_API + "/api/user/account", {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: newFormData,
        });
        const data = await res.json();
        if (data.error) {
            setErrorUpdate(data.error);
        } else {
            window.location.reload();
        }
    };

    const handleDeleteUser = async () => {
        const res = await fetch(process.env.NEXT_PUBLIC_URL_API + "/api/user/account", {
            method: "DELETE",
            credentials: "include",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        const data = await res.json();
        if (data.error) {
            setErrorDelete(data.error);
        } else {
            window.location.reload();
        }
    };

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
                        <>
                            <h2>Update</h2>
                            {errorUpdate && (
                                <div className="alert alert-danger" role="alert">
                                    {errorUpdate}
                                </div>
                            )}
                            <form onSubmit={handleUpdateUser} className="d-grid gap-3 mb-2">
                                <div className="col-md-4 offset-md-4">
                                    <div className="d-flex justify-content-center mb-2">
                                        <img
                                            src={
                                                formData.image
                                                    ? URL.createObjectURL(formData.image)
                                                    : user.image
                                                    ? process.env.NEXT_PUBLIC_URL_API + user.image
                                                    : user.imageOauth
                                                    ? user.imageOauth
                                                    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                                            }
                                            alt={user.username}
                                            className="rounded-circle"
                                            style={{ objectFit: "cover" }}
                                            width="200"
                                            height="200"
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <button
                                            type="button"
                                            className="btn btn-primary w-100 position-relative"
                                        >
                                            <input
                                                type="file"
                                                name="image"
                                                placeholder="Image"
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        image: e.target.files[0],
                                                    })
                                                }
                                                className="form-control position-absolute fixed-top opacity-0"
                                                accept="image/png, image/jpeg"
                                            />
                                            Change image
                                        </button>
                                    </div>
                                </div>
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
                                    />
                                    {!verifyField(formData.password, "password") && (
                                        <div className="invalid-feedback">
                                            Please provide a valid password. <br />
                                            - At least 8 characters <br />
                                            - Must contain at least 1 uppercase letter, 1 lowercase
                                            letter, and 1 number <br />- Can contain special
                                            characters
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <button type="submit" className="btn btn-warning">
                                        Update
                                    </button>
                                </div>
                            </form>
                            <h2>Delete</h2>
                            <button onClick={handleShow} className="btn btn-danger mb-2">
                                Delete
                            </button>
                            <Modal show={show} onHide={handleClose} centered>
                                <Modal.Header closeButton>
                                    <Modal.Title>Delete user</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    {errorDelete && (
                                        <div className="alert alert-danger" role="alert">
                                            {errorDelete}
                                        </div>
                                    )}
                                    Are you sure you want to delete your account?
                                </Modal.Body>
                                <Modal.Footer>
                                    <button className="btn btn-secondary" onClick={handleClose}>
                                        Close
                                    </button>
                                    <button className="btn btn-danger" onClick={handleDeleteUser}>
                                        Delete
                                    </button>
                                </Modal.Footer>
                            </Modal>
                            <br />
                        </>
                    ) : (
                        <h1>You are not logged in</h1>
                    )}
                </div>
            </main>
        </>
    );
}
