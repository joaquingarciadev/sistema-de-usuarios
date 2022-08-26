import React, { useContext, useEffect, useState } from "react";
import AppContext from "../contexts/AppContext";
import Link from "next/link";

function Navbar() {
    const { user } = useContext(AppContext);
    const [showList, setShowList] = useState(false);

    useEffect(() => {
        const closeDropdown = (e) => {
            if (
                e.path[0].tagName == "HTML" ||
                (e.path[0].offsetParent && !e.path[0].offsetParent.className.includes("dropdown"))
            )
                setShowList(false);
        };
        window.addEventListener("click", closeDropdown);
        return () => window.removeEventListener("click", closeDropdown);
    }, []);

    const handleLogout = async (e) => {
        e.preventDefault();
        await fetch(process.env.NEXT_PUBLIC_URL_API + "/api/logout", {
            method: "POST",
            credentials: "include",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.reload();
    };

    return (
        <>
            <header className="border-bottom" style={{ height: "60px" }}>
                <div className="container-md h-100 d-flex justify-content-end align-items-center">
                    {user ? (
                        <div className="dropdown">
                            <a
                                href="#"
                                className="dropdown-toggle text-dark"
                                onClick={() => setShowList(!showList)}
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
                                className={showList ? "dropdown-menu show" : "dropdown-menu"}
                                style={{ right: "0" }}
                            >
                                <Link href="/">
                                    <a className="dropdown-item">Profile</a>
                                </Link>
                                <Link href="/settings">
                                    <a className="dropdown-item">Settings</a>
                                </Link>
                                {user.role === "admin" && (
                                    <Link href="/users">
                                        <a className="dropdown-item">Users</a>
                                    </Link>
                                )}
                                <div className="dropdown-divider"></div>
                                <a href="#" className="dropdown-item" onClick={handleLogout}>
                                    Log out
                                </a>
                            </ul>
                        </div>
                    ) : (
                        <div className="d-flex gap-2">
                            <Link href="/login">
                                <button type="button" className="btn btn-outline-primary">
                                    Log in
                                </button>
                            </Link>
                            <Link href="/signup">
                                <button type="button" className="btn btn-primary">
                                    Sign up
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </header>
        </>
    );
}

export default Navbar;
