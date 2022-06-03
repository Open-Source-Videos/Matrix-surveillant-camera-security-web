//
// Copyright (c) Open Source Video Team and contributors. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for details.
//

import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

class Page404 extends React.Component{
    render(){
        return (
            <div className="container mx-auto h-screen">
                <img 
                    src={"404 Error-bro.svg"} 
                    alt="404 Error" 
                    className="object-contain h-screen w-full" 
                />
                <div className="text-center">
                    <Link to="/" className="text-red-600 text-decoration-none">Go to Home </Link>
                </div>
            </div>
        )
    }
}
export default Page404;