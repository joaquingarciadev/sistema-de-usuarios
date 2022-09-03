import Link from "next/link";

export default function VerifyEmail({ data }) {
    return (
        <>
            <div className="container-md pt-5">
                <div className="col-md-6 offset-md-3">
                    <h1>Verify email</h1>
                    {!data ? (
                        <div className="fixed-top vh-100 d-flex justify-content-center align-items-center">
                            <div className="spinner-border" role="status"></div>
                        </div>
                    ) : data.error ? (
                        <div className={"alert alert-danger"} role="alert">
                            {data.error}
                        </div>
                    ) : (
                        <div className={"alert alert-success"} role="alert">
                            You have been succesfuly activated. You can login now!{" "}
                            <Link href="/login">
                                <a className="alert-link">Login</a>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export async function getServerSideProps(context) {
    const { token } = context.params;
    const res = await fetch(process.env.NEXT_PUBLIC_URL_API + "/api/verify/" + token);
    const data = await res.json();

    return { props: { data } };
}
