import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
var timeOut;
const Page403 = () => {
    const [delayRender, setDelayRender] = useState(true);

    useEffect(() => {
        timeOut = setTimeout(() => {
            setDelayRender(false);
        }, 30000);

        return () => {
            clearTimeout(timeOut);
        };
    }, []);
    return (
        <>
            {delayRender ? (
                <>
                    <div className="flex items-center justify-center content-center h-screen">
                        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full m-auto" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </>
            ) : (
                <div className="container mx-auto h-screen">
                    <img
                        src={'403 Error Forbidden-bro.svg'}
                        alt="403 Error"
                        className="object-contain h-screen w-full"
                    />
                    <div className="text-center">
                        <Link
                            to="/"
                            className="text-red-600 text-decoration-none"
                        >
                            Go to Home{' '}
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
};
export default Page403;
