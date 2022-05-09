import React, { 
	useState,
	useEffect,
    Fragment
} from 'react';
import useMatrixClient from '../../hooks/useMatrixClient';
import { 
	Popover, 
	Transition 
} from '@headlessui/react'
import { 
    useHistory, 
    useLocation 
} from "react-router-dom";
import { clearState } from '../../pages/Homepage';
import { clearAllStates } from "../../pages/Requests";
import {
	MenuIcon,
	XIcon,
} from '@heroicons/react/outline'


const TopNavigationBar = () => {
    const history = useHistory();
    const { 
        isLogin, 
        logoutMatrixServer,
		getAvatar,
		testLogin,
    } = useMatrixClient();
    const location = useLocation();
    const { pathname } = location;
    const splitLocation = pathname.split("/");

    const handleRouter = (link,e) => {
        e.preventDefault();
        //let link = e.target.href;
        let target = window.location.origin + "/";
		console.log('link=',link);
        let p = link?.replace(target, "");
        history.push(p);
    }

    const handleLogout = () => {
        logoutMatrixServer();
        history.push("/login");
        clearState();
		clearAllStates();
    }

    const tabItem = "text-gray-800 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium text-decoration-none";
    const tabItemMenu = "-m-3 p-3 flex items-center rounded-md hover:bg-gray-50 text-decoration-none"
    const tabItemMenuText = "ml-3 text-base font-medium text-gray-900 text-decoration";

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
		<Popover className={(splitLocation[1] === "homepage" || splitLocation[1] === "requests") ? "relative bg-white z-50" : "relative bg-amber-200 z-50"}>
			<div className="max-w-7xl mx-auto px-4 sm:px-6">
				<div className="flex justify-between items-center py-6 md:justify-start md:space-x-10">
					<div className="flex justify-start lg:w-0 lg:flex-1">
						<a 
                            href="/" 
                            onClick={ handleRouter }
                            className={"text-decoration-none"}
                        >
							<img
								className="h-6 w-auto sm:h-9 mr-2"
								src="security-camera.png"
								alt="Logo"
							/>
                            <span className="self-center text-sm md:text-xs lg:text-md font-semibold whitespace-nowrap text-black">OpenCamera</span>
						</a>
					</div>

					<div className="-mr-2 -my-2 md:hidden">
						<Popover.Button className="bg-gray-700 rounded-md p-2 inline-flex items-center justify-center text-white hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-300">
							<span className="sr-only">Open menu</span>
							<MenuIcon className="h-6 w-6" aria-hidden="true" />
						</Popover.Button>
					</div>
					
					<Popover.Group as="nav" className="hidden md:flex space-x-1">
						<a 
                            href="/homepage"
                            className={splitLocation[1] === "homepage" ? tabItem.concat(" bg-gray-700 text-white") : tabItem}
                            onClick={(e)=>{ handleRouter("/homepage",e);} }
                        >
							Homepage
						</a>

                        <a 
                            href="/requests"
                            className={splitLocation[1] === "requests" ? tabItem.concat(" bg-gray-700 text-white") : tabItem}
                            onClick={ (e)=>{ handleRouter("/requests",e);} }
                        >
							Requests
						</a>

                        <a 
                            href="/profile"
                            className={splitLocation[1] === "profile" ? tabItem.concat(" bg-gray-700 text-white") : tabItem}
                            onClick={  (e)=>{ handleRouter("/profile",e);} }
                        >
							Profile
						</a>

                        <a 
                            href="/setting" 
                            className={splitLocation[1] === "setting" ? tabItem.concat(" bg-gray-700 text-white") : tabItem}
                            onClick={  (e)=>{ handleRouter("/setting",e);} }
                        >
							Settings
						</a>
              		</Popover.Group>

					<div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
						<button className={"mr-3 hidden lg:block"}>
							<img
								className="inline-block h-8 w-8 rounded-full ring-2 ring-indigo-700"
								src={avatar}
								alt=""
							/>
						</button>
                    {/* isLogin() ? (*/
                        <button
                            type="button" 
                            className="bg-gray-700 hover:bg-amber-500 text-white text-sm font-semibold py-2 px-4 rounded"
                            onClick={ handleLogout }
						>
							Logout
						</button>
                    /*) : (
                        <></>
					)*/}
					</div>
				</div>
			</div>

			<Transition
				as={Fragment}
				enter="duration-200 ease-out"
				enterFrom="opacity-0 scale-95"
				enterTo="opacity-100 scale-100"
				leave="duration-100 ease-in"
				leaveFrom="opacity-100 scale-100"
				leaveTo="opacity-0 scale-95"
			>
				<Popover.Panel focus className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden">
					<div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
						<div className="pt-5 pb-6 px-5">
							<div className="flex items-center justify-between">
								<div>
									<img
										className="h-8 w-auto mr-2"
										src="security-camera.png"
                                        alt="Logo"
									/>
                                    <span className="self-center text-base font-semibold whitespace-nowrap text-black">OpenCamera</span>
								</div>
								<div className="-mr-2">
									<Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-300">
										<span className="sr-only">Close menu</span>
										<XIcon className="h-6 w-6" aria-hidden="true" />
									</Popover.Button>
								</div>
							</div>
							<div className="mt-6">
								<nav className="grid gap-y-8">
									<a 
                                        href="/homepage"
                                        onClick={ handleRouter }
                                        className={ tabItemMenu }
                                    >
										<span className={ tabItemMenuText }>Homepage</span>
									</a>
									<a 
                                        href="/requests"
                                        onClick={ handleRouter }
                                        className={ tabItemMenu }
                                    >
										<span className={ tabItemMenuText }>Requests</span>
									</a>
                                    <a 
                                        href="/profile"
                                        onClick={ handleRouter }
                                        className={ tabItemMenu }
                                    >
										<span className={ tabItemMenuText }>Profile</span>
									</a>
									<a 
                                        href="/setting"
                                        onClick={ handleRouter }
                                        className={ tabItemMenu }
                                    >
										<span className={ tabItemMenuText }>Settings</span>
									</a>
								</nav>
							</div>
						</div>
						<div className="py-6 px-5 space-y-6">
							<div>
								<button className={"mr-3"}>
									<img
										className="inline-block h-8 w-8 rounded-full ring-2 ring-indigo-700"
										src={avatar}
										alt=""
									/>
								</button>
							</div>
							<div>
                            {/* isLogin() ? (*/
								<button
                                    type="button"
                                    onClick = { handleLogout }
									className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gray-700 hover:bg-amber-300"
								>
									Logout
								</button>
                            /*) : (
                                <></>
							)*/}
							</div>
            			</div>
            		</div>
            	</Popover.Panel>
          	</Transition>
    	</Popover>
    )
}

export default TopNavigationBar;
