import { useEffect, useState } from "react";

export default function Dropdown({ img, name, children }) {
    const [showList, setShowList] = useState(false);

    useEffect(() => {
        const closeDropdown = (e) => {
            if (
                !e.path[0].offsetParent ||
                (e.path[0].offsetParent && !e.path[0].offsetParent.className.includes("dropdown"))
            )
                setShowList(false);
        };
        window.addEventListener("click", closeDropdown);
        return () => window.removeEventListener("click", closeDropdown);
    }, []);

    return (
        <>
            <style jsx>
                {`
                    .me-dropdown {
                        position: relative;
                    }

                    .me-dropdown-toggle {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        gap: 5px;
                        cursor: pointer;
                    }

                    .me-dropdown-toggle img {
                        object-fit: cover;
                        border-radius: 999px;
                    }

                    .me-dropdown-list {
                        /* width: 200px; */
                        background: #fff;
                        border: #dfdfdf solid 1px;
                        border-radius: 0.25rem;
                        overflow: hidden;
                        opacity: 0;
                        position: absolute;
                        transform: translateY(50px);
                        z-index: 1001;
                        transition: all 0.3s ease;
                        pointer-events: none;
                    }

                    .me-dropdown-list.show {
                        opacity: 1;
                        transform: translateY(10px);
                        pointer-events: auto;
                    }

                    .me-dropdown-list a {
                        display: inline-block;
                        width: 100%;
                        height: 100%;
                        padding: 16px 30px;
                    }

                    .me-dropdown-list a:hover {
                        background: #111;
                        color: #fff;
                    }
                `}
            </style>
            <div className="dropdown">
                <a
                    href="#"
                    className="dropdown-toggle"
                    onClick={() => {
                        setShowList(!showList);
                    }}
                >
                    {img && (
                        <img
                            src={img}
                            // "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                            alt="img"
                            width="40"
                            height="40"
                        />
                    )}
                    {name}
                    <span style={{ fontSize: "10px" }}>&#x25BC;</span>
                </a>
                <div className={showList ? "dropdown-list show" : "dropdown-list"}>{children}</div>
            </div>
        </>
    );
}
