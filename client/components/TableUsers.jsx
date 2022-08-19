import React, { useContext, useEffect, useState } from "react";
import AppContext from "../contexts/AppContext";
import Modal from "react-bootstrap/Modal";

function TableUsers() {
    const { user } = useContext(AppContext);
    const [users, setUsers] = useState([]);
    const [resultUsers, setResultUsers] = useState([]);
    const [formData, setFormData] = useState({});
    const [showFormUser, setShowFormUser] = useState(false);
    const [idFormUser, setIdFormUser] = useState(null);
    const [errorMessageEdit, setErrorMessageEdit] = useState("");
    const [errorMessageDelete, setErrorMessageDelete] = useState("");
    const [searchData, setSearchData] = useState("");

    useEffect(() => {
        getUsers();
        const interval = setInterval(getUsers, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (searchData === "") {
            setResultUsers(users);
        } else {
            setResultUsers(
                users.filter(({ username }) =>
                    username
                        .toLowerCase()
                        .replace(/ /g, "")
                        .includes(searchData.toLowerCase().replace(/ /g, ""))
                )
            );
        }
    }, [searchData, users]);

    useEffect(() => {
        setShowFormUser(false);
    }, [searchData]);

    const getUsers = async () => {
        const res = await fetch(process.env.NEXT_PUBLIC_URL_API + "/api/users", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        const data = await res.json();
        setUsers(data);
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        const res = await fetch(process.env.NEXT_PUBLIC_URL_API + `/api/user/${idFormUser}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.error) {
            setErrorMessageEdit(data.error);
        } else {
            getUsers();
            setShowFormUser(false);
        }
    };

    const handleDeleteUser = async (id) => {
        const res = await fetch(process.env.NEXT_PUBLIC_URL_API + `/api/user/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        const data = await res.json();
        if (data.error) {
            setErrorMessageDelete(data.error);
        } else {
            getUsers();
        }
        setShowFormUser(false);
    };

    const handleFormUser = (id) => {
        setErrorMessageEdit("");
        setShowFormUser(!showFormUser);
        setIdFormUser(id);
    };

    return (
        <>
            <h2>Users</h2>

            <Modal show={showFormUser} onHide={() => setShowFormUser(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit user</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errorMessageEdit && (
                        <div className="alert alert-danger" role="alert">
                            {errorMessageEdit}
                        </div>
                    )}
                    <form className="d-grid gap-3">
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
                        />
                        <select
                            name="role"
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    role: e.target.value,
                                })
                            }
                            className="form-select"
                        >
                            <option value="">Role</option>
                            <option value="ADMIN">ADMIN</option>
                            <option value="USER">USER</option>
                        </select>
                        <select
                            name="status"
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    status: e.target.value,
                                })
                            }
                            className="form-select"
                        >
                            <option value="">Status</option>
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="INACTIVE">INACTIVE</option>
                        </select>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={handleUpdateUser}>
                        Save Changes
                    </button>
                </Modal.Footer>
            </Modal>

            {errorMessageDelete && (
                <div className="alert alert-danger" role="alert">
                    {errorMessageDelete}
                </div>
            )}

            <form className="mb-3">
                <input
                    type={"text"}
                    placeholder={"Search users..."}
                    onChange={(e) => setSearchData(e.target.value)}
                    className="form-control"
                />
            </form>

            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr className="table-dark">
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Created at</th>
                            <th>Updated at</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="table-secondary">
                            <td>
                                <img
                                    src={
                                        user.image
                                            ? process.env.NEXT_PUBLIC_URL_API + user.image
                                            : user.imageOauth
                                            ? user.imageOauth
                                            : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                                    }
                                    alt={user.username}
                                    className="rounded-circle"
                                    style={{ objectFit: "cover" }}
                                    width="40"
                                    height="40"
                                />
                                &ensp;{user.username}
                            </td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <span
                                    className={
                                        user.status === "INACTIVE"
                                            ? "badge rounded-pill text-bg-secondary"
                                            : "badge rounded-pill text-bg-success"
                                    }
                                >
                                    {user.status}
                                </span>
                            </td>
                            <td>{user.createdAt.replace("T", " ").slice(0, -8)}</td>
                            <td>{user.updatedAt.replace("T", " ").slice(0, -8)}</td>
                            <td></td>
                        </tr>
                        {users &&
                            resultUsers.map(
                                ({
                                    _id,
                                    image,
                                    imageOauth,
                                    username,
                                    email,
                                    role,
                                    status,
                                    createdAt,
                                    updatedAt,
                                }) => {
                                    if (username !== user.username) {
                                        return (
                                            <tr key={_id}>
                                                <td>
                                                    <img
                                                        src={
                                                            image
                                                                ? process.env.NEXT_PUBLIC_URL_API +
                                                                  image
                                                                : imageOauth
                                                                ? imageOauth
                                                                : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                                                        }
                                                        alt={username}
                                                        className="rounded-circle"
                                                        width="40"
                                                        height="40"
                                                    />
                                                    &ensp;{username}
                                                </td>
                                                <td>{email}</td>
                                                <td>{role}</td>
                                                <td>
                                                    <span
                                                        className={
                                                            status === "INACTIVE"
                                                                ? "badge rounded-pill text-bg-secondary"
                                                                : "badge rounded-pill text-bg-success"
                                                        }
                                                    >
                                                        {status}
                                                    </span>
                                                </td>
                                                <td>{createdAt.replace("T", " ").slice(0, -8)}</td>
                                                <td>{updatedAt.replace("T", " ").slice(0, -8)}</td>
                                                <td className="d-flex gap-3">
                                                    <button
                                                        onClick={() => handleFormUser(_id)}
                                                        className="btn btn-warning"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(_id)}
                                                        className="btn btn-danger"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    }
                                }
                            )}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default TableUsers;
