import { useState } from "react";

export default function Navbar({ children }) {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <style jsx>
                {`
                    /* GENERAL */
                    .btn {
                        font-size: xx-large;
                        font-weight: bold;
                        cursor: pointer;
                    }

                    /* MODAL */
                    .me-modal {
                        width: 300px;
                        background: #fff;
                        border: #dfdfdf solid 1px;
                        border-radius: 0.25rem;
                        opacity: 0;
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, 0);
                        z-index: 1002;
                        transition: all 0.3s ease;
                        pointer-events: none;
                    }

                    .me-modal.show {
                        opacity: 1;
                        transform: translate(-50%, -50%);
                        pointer-events: auto;
                    }

                    .me-modal-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        height: 60px;
                        padding: 0 30px;
                    }

                    /* .me-modal-body {
                    padding: 16px 30px;
                } */

                    .me-offcanvas {
                        width: 100%;
                        height: 100%;
                        background: #000;
                        opacity: 0;
                        position: fixed;
                        top: 0;
                        left: 0;
                        z-index: 1001;
                        transition: all 0.3s ease;
                        pointer-events: none;
                    }

                    .me-offcanvas.show {
                        opacity: 0.3;
                        pointer-events: auto;
                        cursor: pointer;
                    }
                `}
            </style>
            {/* OFFCANVAS */}
            <div
                className={showModal ? "offcanvas show" : "offcanvas"}
                onClick={() => {
                    setShowModal(false);
                }}
            ></div>

            <div
                onClick={() => {
                    setShowModal(!showModal);
                }}
                className="btn"
            >
                &#8801;
            </div>

            {/* MODAL */}
            <div className={showModal ? "modal show" : "modal"}>
                <div className="modal-header">
                    <h3></h3>
                    <div
                        onClick={() => {
                            setShowModal(!showModal);
                        }}
                        className="btn"
                    >
                        &#215;
                    </div>
                </div>
                <div className="modal-body">{children}</div>
            </div>
        </>
    );
}
