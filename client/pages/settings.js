import { useContext, useEffect, useState } from "react";
import AppContext from "../contexts/AppContext";
import Head from "next/head";
import Navbar from "../components/Navbar";

export default function Settings() {
    const { user, loading } = useContext(AppContext);
    const [formData, setFormData] = useState({});
    const [errorUpdate, setErrorUpdate] = useState("");
    const [errorDelete, setErrorDelete] = useState("");

    const handleUpdateUser = async (e) => {
        e.preventDefault();

        const newFormData = new FormData();
        for (const key in formData) {
            newFormData.append(key, formData[key]);
        }

        const res = await fetch(process.env.NEXT_PUBLIC_URL_API + "/api/user/me", {
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
        const res = await fetch(process.env.NEXT_PUBLIC_URL_API + "/api/user/me", {
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
                <title>Settings</title>
            </Head>
            <main>
                <Navbar />
                <div className="container-md">
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
                            <form onSubmit={handleUpdateUser} className="mb-2">
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
                                    className="form-control mb-2"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    onChange={(e) =>
                                        setFormData({ ...setFormData, email: e.target.value })
                                    }
                                    className="form-control mb-2"
                                />
                                <input
                                    type="text"
                                    name="password"
                                    placeholder="Password"
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            password: e.target.value,
                                        })
                                    }
                                    className="form-control mb-2"
                                />
                                <button type="submit" className="btn btn-warning">
                                    Update
                                </button>
                            </form>
                            <h2>Delete</h2>
                            {errorDelete && (
                                <div className="alert alert-danger" role="alert">
                                    {errorDelete}
                                </div>
                            )}
                            <button
                                onClick={() => {
                                    const confirm = window.confirm("Are you sure?");
                                    if (confirm) handleDeleteUser();
                                }}
                                className="btn btn-danger"
                            >
                                Delete
                            </button>
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
