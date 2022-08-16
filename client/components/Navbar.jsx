import React, { useContext, useState } from "react";
import AppContext from "../contexts/AppContext";
import Link from "next/link";

function Navbar() {
    const { user } = useContext(AppContext);
    const [show, setShow] = useState(false);

    const handleLogout = async (e) => {
        e.preventDefault();
        await fetch(process.env.NEXT_PUBLIC_URL_API + "/api/logout", {
            method: "POST",
            credentials: "include",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true,
            },
        });
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.reload();
    };

    return (
        <header className="border-bottom" style={{ height: "60px" }}>
            <div className="container h-100 d-flex justify-content-end align-items-center">
                {user ? (
                    <div className="dropdown">
                        <a
                            href="#"
                            className="dropdown-toggle text-dark"
                            onClick={() => setShow(!show)}
                        >
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
                        </a>
                        <ul
                            className={show ? "dropdown-menu show" : "dropdown-menu"}
                            style={{ right: "0" }}
                        >
                            <Link href="/">
                                <a className="dropdown-item">Profile</a>
                            </Link>
                            <Link href="/settings">
                                <a className="dropdown-item">Settings</a>
                            </Link>
                            {user.role === "ADMIN" && (
                                <Link href="/users">
                                    <a className="dropdown-item">Users</a>
                                </Link>
                            )}
                            <div className="dropdown-divider"></div>
                            <a href="#" className="dropdown-item" onClick={handleLogout}>
                                Logout
                            </a>
                        </ul>
                    </div>
                ) : (
                    <div className="d-flex gap-2">
                        <Link href={"/login"} passHref>
                            <button type="button" className="btn btn-outline-primary">
                                Login
                            </button>
                        </Link>
                        <Link href={"/signup"} passHref>
                            <button type="button" className="btn btn-primary">
                                Signup
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Navbar;
