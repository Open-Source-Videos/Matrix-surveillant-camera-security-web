import React from 'react';
import { Link } from 'react-router-dom';

class Page403 extends React.Component{
    render(){
        return (
            <div className="container mx-auto h-screen">
                <img 
                    src={"403 Error Forbidden-bro.svg"} 
                    alt="403 Error" 
                    className="object-contain h-screen w-full" 
                />
                <div className="text-center">
                    <Link to="/" className="text-red-600 text-decoration-none">Go to Home </Link>
                </div>
            </div>
        )
    }
}
export default Page403;