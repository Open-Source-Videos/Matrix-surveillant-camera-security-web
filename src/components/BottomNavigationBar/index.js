//
// Copyright (c) Open Source Video Team and contributors. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for details.
//

import React, { 
	useState,
	useEffect
} from 'react';
import useMatrixClient from '../../hooks/useMatrixClient';
import { 
    useHistory, 
    useLocation 
} from "react-router-dom";
import { clearState } from '../../pages/Homepage';
import { clearAllStates } from "../../pages/Requests";
import {
    HomeIcon,
    AnnotationIcon,
    CogIcon
} from '@heroicons/react/outline'


const BottomNavigationBar = () => {
    const history = useHistory();
    const { 
        isLogin,
		getAvatar,
		testLogin,
    } = useMatrixClient();
    const location = useLocation();
    const { pathname } = location;
    const splitLocation = pathname.split("/");

    const handleRouter = (e, target_link) => {
        e.preventDefault();
        //console.log("TARGET:", e.target)
        //let link = e.target.href;
        //console.log("LINK: ", link);

        console.log("LINK: ", target_link);

        //let target = window.location.origin + "/";
        //console.log("TARGET: ", target)
        //let p = target_link?.replace(target, "");
        //console.log("P: ", p)
        //history.push(p);
        history.push(target_link);
    }

	const [avatar, setAvatar] = useState(null);
	const [yesLogin, setYesLogin] = useState(false);

	useEffect(() => {
        (async () => {
            if (isLogin() === false) {
                console.log('Run test login');
                setYesLogin(await testLogin());
            }
            setTimeout(() => {
                setYesLogin(isLogin());
				const get_avatar = () => {
					(async () => {
						try {
							let profileAvatar = await getAvatar();
							if (profileAvatar === null || profileAvatar === '') {
								setAvatar('logo_profile_static_avatar.svg');
							} else {
								setAvatar(profileAvatar);
							}
						} catch (e) {
							console.log('error', e);
							setAvatar(null);
						}
					})();
				};

				get_avatar();
			}, 500);
		})();
		}, [avatar, isLogin, testLogin]);


	return (
        <section 
            id="bottom-navigation" 
            className="md:hidden block fixed inset-x-0 bottom-0 z-10 bg-white shadow"
        >
            <div 
                id="tabs" 
                className="flex justify-between"
            >
                <a 
                    href={"/homepage"}
                    onClick={ () => handleRouter("homepage") }
                    className="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center py-3"
                >
                    <HomeIcon 
                        width={"30"}
                        height={"30"}
                        className="inline-block mb-1 text-gray-800"
                    />
                    {/*<span className="tab tab-home block text-xs">Homepage</span>*/}
                </a>

                <a 
                    href="/requests" 
                    onClick={ () => handleRouter("requests") }
                    className="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center py-3"
                >
                    <AnnotationIcon 
                        width={"30"}
                        height={"30"}
                        className="inline-block mb-1 text-gray-800"
                    />
                    {/* <span className="tab tab-home block text-xs">Requests</span> */}
                </a>

                <a 
                    href="/setting"  
                    onClick={ () => handleRouter("setting") }
                    className="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center py-3"
                >
                    <CogIcon 
                        width={"30"}
                        height={"30"}
                        className="inline-block mb-1 text-gray-800"
                    />
                    {/* <span className="tab tab-home block text-xs">Settings</span> */}
                </a>

                <a 
                    href="/profile"  
                    onClick={ () => handleRouter("profile") }
                    className="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center py-3"
                >
                    <img
                        className="inline-block rounded-full ring-2 ring-indigo-700 mb-1 text-gray-800"
                        width={"30"}
                        height={"30"}
                        src={avatar}
                        alt="Profile"
                    />
                    {/* <span className="tab tab-home block text-xs">Profiles</span> */}
                </a>
            </div>
        </section>
    )
}

export default BottomNavigationBar;
