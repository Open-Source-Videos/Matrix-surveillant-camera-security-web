import React, { 
    useState 
} from "react";
import { Transition } from "@headlessui/react";
import { useHistory } from "react-router-dom";
import useMatrixClient from "../../hooks/useMatrixClient";

const TopNavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const history = useHistory();
    const { isLogin, logoutMatrixServer } = useMatrixClient();

    const handleRouter = (e) => {
        e.preventDefault();
        let link = e.target.href;
        let target = window.location.origin + "/";
        let p = link.replace(target, "");
        history.push(p);
    }

    const tabItem = "text-gray-800 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium text-decoration-none"
    const tabItemMobile = "hover:bg-gray-700 text-gray-800 hover:text-white block px-3 py-2 rounded-md text-base font-medium text-decoration-none"

    return (
        <div>
            <nav className="bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <img
                                className="h-6 sm:h-9 mr-3"
                                src="security-camera.png"
                                alt="Logo"
                            />
                            <span className="self-center text-md font-semibold whitespace-nowrap text-black">OpenCamera</span>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <a
                                    href="/homepage"
                                    onClick={handleRouter}
                                    className={tabItem}
                                >
                                    Homepage
                                </a>

                                <a
                                    href="/profile"
                                    onClick={handleRouter}
                                    className={tabItem}
                                >
                                    Profile
                                </a>

                                <a
                                    href="/setting"
                                    onClick={handleRouter}
                                    className={tabItem}
                                >
                                    Settings
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        { isLogin() ? (
                            <button 
                                type="button" 
                                className="bg-gray-700 hover:bg-amber-300 text-white font-semibold py-2 px-4 rounded"
                                onClick = {() => {
                                    logoutMatrixServer();
                                    console.log("=======================")
                                    console.log("IS LOGIN: ", isLogin());
                                    console.log("=======================")
                                }
                            }
                            >
                                Logout
                            </button>
                        ) : (
                            <></>
                        )}
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            type="button"
                            className="bg-gray-900 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                            aria-controls="mobile-menu"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isOpen ? (
                            <svg
                                className="block h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                            ) : (
                            <svg
                                className="block h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                            )}
                        </button>
                    </div>
                </div>
                </div>

                <Transition
                    show={isOpen}
                    enter="transition ease-out duration-100 transform"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="transition ease-in duration-75 transform"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                {(ref) => (
                    <div className="md:hidden" id="mobile-menu">
                        <div ref={ref} className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <a
                                href="/homepage"
                                onClick={handleRouter}
                                className={tabItemMobile}
                            >
                                Homepage
                            </a>

                            <a
                                href="/profile"
                                onClick={handleRouter}
                                className={tabItemMobile}
                            >
                                Profile
                            </a>

                            <a
                                href="/setting"
                                onClick={handleRouter}
                                className={tabItemMobile}
                            >
                                Settings
                            </a>

                            { isLogin() ? (
                                <button 
                                    type="button" 
                                    className="bg-gray-700 hover:bg-amber-300 text-white font-semibold py-2 px-4 rounded"
                                    onClick = {() => logoutMatrixServer() }
                                >
                                    Logout
                                </button>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                )}
                </Transition>
            </nav>
        </div>
  );
}

export default TopNavBar;
