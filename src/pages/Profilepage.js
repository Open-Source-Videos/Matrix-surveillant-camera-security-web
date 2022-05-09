import { useState, useEffect, Fragment } from 'react';
import useMatrixClient from '../hooks/useMatrixClient';
import TopNavigationBar from '../components/TopNavigationBar';
import Page403 from './Page403';
import { Menu, Transition } from '@headlessui/react'
import { useHistory } from "react-router-dom";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

const ProfileView = ({ avatar, userID, displayName, roomID, roomList }) => {
     const [showModal, setShowModal] = useState(false);
     const [changeName, setShowChangeName] = useState(false);
     const [newName, setChangeName] = useState(null);
     const { setAvatar, setDisplayName } = useMatrixClient();
     const history = useHistory();

     const handleChangeImage = async (e) =>{
        console.log('log =',e);
        const reader = new FileReader();
        var file = document.getElementById('imagetest').files[0];
        console.log('file =',file);
        console.log(reader);
        reader.readAsArrayBuffer(file);
        reader.addEventListener('load',(evt)=>{
           setAvatar(file.name,evt.target.result);
        });
    }

    const handleChangeName = async (e) => {
        setDisplayName(e);
    }



    const listItems = roomList.map((number, index) =>
        <li key={index}>
            {number.name}
        </li>
    );
    return (
        <>
            <main className="profile-page">
                <section className="relative block" style={{ height: '450px' }}>
                    <div
                        className="absolute top-0 w-full h-full bg-center bg-cover bg-amber-200"
                        style={{
                            backgroundImage: "url('/profile_cover_page.svg')",
                            backgroundPosition: 'center',
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                        }}
                    ></div>
                    <div
                        className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden"
                        style={{ height: '70px' }}
                    >
                        <svg
                            className="absolute bottom-0 overflow-hidden"
                            xmlns="http://www.w3.org/2000/svg"
                            preserveAspectRatio="none"
                            version="1.1"
                            viewBox="0 0 2560 100"
                            x="0"
                            y="0"
                        >
                            <polygon
                                className="text-white fill-current"
                                points="2560 0 2560 100 0 100"
                            ></polygon>
                        </svg>
                    </div>
                </section>
                <section className="relative py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
                            <div className="px-6">
                                <div className="flex flex-wrap justify-center">
                                    
                                    <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                                        <div className="relative ml-16">
                                            
                                            <img
                                                alt="..."
                                                src={avatar}
                                                className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16"
                                                style={{ maxWidth: '150px' }}
                                            />
                                            
                                        </div>
                                        <Menu as="div" className="relative mt-14 mx-4">
                                            <Menu.Button class="flex flex-wrap items-center justify-center  w-10 h-10 text-gray-700 transition-colors duration-150 bg-yellow-300 rounded-full focus:shadow-outline hover:bg-gray-200"
                                                    type="button"
                                                    // onClick={() => setShowModal(true)}>
                                                    >
                                                        
                                                <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>
                                            </Menu.Button >

                                            <Transition
                                                as={Fragment}
                                                enter="transition ease-out duration-100"
                                                enterFrom="transform opacity-0 scale-95"
                                                enterTo="transform opacity-100 scale-100"
                                                leave="transition ease-in duration-75"
                                                leaveFrom="transform opacity-100 scale-100"
                                                leaveTo="transform opacity-0 scale-95"
                                            >
                                                <Menu.Items className="origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                <div className="py-1">
                                                    <Menu.Item>
                                                    {({ active }) => (
                                                        <a
                                                        className={classNames(
                                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                            'block px-4 py-2 text-sm'
                                                        )}
                                                        type="button"
                                                        onClick={() => setShowModal(true)}
                                                        >
                                                        Edit Avarta
                                                        </a>
                                                    )}
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                    {({ active }) => (
                                                        <a
                                                        href="#"
                                                        className={classNames(
                                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                            'block px-4 py-2 text-sm'
                                                        )}
                                                        type="button"
                                                        onClick={() => setShowChangeName(true)}
                                                        >
                                                        Change Name
                                                        </a>
                                                    )}
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                    {({ active }) => (
                                                        <a
                                                        href="#"
                                                        className={classNames(
                                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                            'block px-4 py-2 text-sm'
                                                        )}
                                                        >
                                                        Change Password
                                                        </a>
                                                    )}
                                                    </Menu.Item>
                                                    <form method="POST" action="#">
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                        <a
                                                            type="submit"
                                                            className={classNames(
                                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                            'block w-full text-left px-4 py-2 text-sm'
                                                            )}
                                                            onClick={() => history.push('/room')}
                                                        >
                                                            Change room
                                                        </a>
                                                        )}
                                                    </Menu.Item>
                                                    </form>
                                                </div>
                                                </Menu.Items>
                                            </Transition>
      
                                        </Menu>
                                        {showModal ? (
                                            <>
                                                <div
                                                    className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                                                >
                                                    <div className="relative w-auto my-6 mx-auto max-w-3xl">
                                                    {/*content*/}
                                                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                                        {/*header*/}
                                                        <div className="mt-4 flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                                        <img class="mr-5 h-12 w-auto" src="icons8-tiger-96.png" alt="Workflow"></img>
                                                        <h3 className="text-3xl font-semibold">
                                                            Edit Avarta
                                                        </h3>
                                                        <button
                                                            className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                                            onClick={() => setShowModal(false)}
                                                        >
                                                            <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                                            ×
                                                            </span>
                                                        </button>
                                                        </div>
                                                        {/*body*/}
                                                    
                                                        <div class="relative p-6 flex-auto">
                                                            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Change Picture</label>
                                                            <input type={'file'}  id={'imagetest'} accept={'*'} ></input>
                                                            <div id= {"display-image"}></div>
                                                        </div>
                                                        <div class="relative p-6 flex-auto mb-6">
                                                            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remove Picture</label>
                                                            <button class="h-10 w-100 px-5 text-yellow-400 duration-150 border-2 border-yellow-400 rounded-lg focus:shadow-outline hover:bg-yellow-400 hover:text-white">Remove Picture</button>
                                                        </div>

                            
                                
                                                        
                                                        {/*footer*/}
                                                        <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                                        <button
                                                            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                            type="button"
                                                            onClick={() => setShowModal(false)}
                                                        >
                                                            Close
                                                        </button>
                                                        <button
                                                            className="bg-yellow-400 text-white active:bg-yellow-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                            type="button"
                                                            
                                                            onClick={() => {handleChangeImage(); setShowModal(false)}}
                                                        >
                                                            Save Changes
                                                        </button>
                                                        </div>
                                                    </div>
                                                    </div>
                                                </div>
                                                <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                                            
                                            </>
                                        ) : null}

                                        {changeName ? (
                                                <>
                                                    <div
                                                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                                                    >
                                                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                                                        {/*content*/}
                                                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                                            {/*header*/}
                                                            <div className="mt-4 flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                                            <img class="mr-5 h-12 w-auto" src="icons8-tiger-96.png" alt="Workflow"></img>
                                                            <h3 className="text-3xl font-semibold">
                                                                Change Name
                                                            </h3>
                                                           
                                                        </div>
                                                            {/*body*/}
                                                        
                                                            <div class="relative p-6 flex-auto">
                                                                <label for="nameText" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Enter the new User Name: </label>
                                                                <input  class="w-100" type={'text'}  id={'nameText'} onChange={event => setChangeName(event.target.value)}></input>
                                                                
                                                            </div>
                                                            

                                
                                    
                                                            
                                                            {/*footer*/}
                                                            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                                            <button
                                                                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                                type="button"
                                                                onClick={() => setShowChangeName(false)}
                                                            >
                                                                Close
                                                            </button>
                                                            <button
                                                                className="bg-yellow-400 text-white active:bg-yellow-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                                type="button"
                                                                
                                                                onClick={() => {handleChangeName(newName); setShowChangeName(false)}}
                                                            >
                                                                Save Changes
                                                            </button>
                                                            </div>
                                                        </div>
                                                        </div>
                                                    </div>
                                                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                                                
                                                </>
                                            ) : null}
                           
                           










                                        
                                    </div>

                                </div>
                              
                                <div className="text-center">
                                    
                                    <h3 className="text-4xl font-semibold leading-normal mb-2 text-gray-800 pt-5">
                                        {displayName}
                                    </h3>
                                    
                                    <div className="mb-2 text-gray-700">
                                        <i className="fas fa-university mr-2 text-lg text-gray-500"></i>
                                        <h6>User ID:</h6> {userID}
                                    </div>
                                    <div className="mb-2 text-gray-700">
                                        <i className="fas fa-university mr-2 text-lg text-gray-500"></i>
                                        <h6>Room ID:</h6> {roomID}
                                    </div>
                                    <div className="mb-2 text-gray-700">
                                        <i className="fas fa-university mr-2 text-lg text-gray-500"></i>
                                        <h6>Room List:</h6>
                                       {listItems}
                                    </div>
                                </div>
                                <div className="mt-10 py-10 border-t border-gray-300 text-center">
                                    <div className="flex flex-wrap justify-center">
                                        <div className="w-full lg:w-9/12 px-4">
                                            <p className="mb-4 text-lg leading-relaxed text-gray-800">
                                                An artist of considerable range,
                                                Jenna the name taken by
                                                Melbourne-raised, Brooklyn-based
                                                Nick Murphy writes, performs and
                                                records all of his own music,
                                                giving it a warm, intimate feel
                                                with a solid groove structure.
                                                An artist of considerable range.
                                            </p>
                                            <a
                                                href="#pablo"
                                                className="font-normal text-pink-500"
                                                onClick={(e) =>
                                                    e.preventDefault()
                                                }
                                            >
                                                Show more
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <img src={'/wave-haikei.svg'} alt="footer" width={'100%'} />
                <footer className="relative pb-4 bg-amber-300">
                    <div className="flex flex-wrap items-center md:justify-between justify-center ">
                        <div className="w-full md:w-4/12 px-4 mx-auto text-center">
                            <div className="text-sm text-black font-semibold py-1">
                                Open Source Security Camera App - 2022
                            </div>
                        </div>
                    </div>
                </footer>
            </main>
        </>
    );
};

const Profile = () => {
    const {
        isLogin,
        getAvatar,
        testLogin,
        getDisplayName,
        getRoomIdByName,
        getUserId,
        getMatrixRooms,
    } = useMatrixClient();
    const [yesLogin, setYesLogin] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [userID, setUserId] = useState(null);
    const [displayName, setDisplayName] = useState(null);
    const [roomID, setRoomID] = useState(null);
    const [roomList, setRoomList] = useState([]);

    useEffect(() => {
        (async () => {
            if (isLogin() === false) {
                console.log('Run test login');
                await testLogin();
            }
            setTimeout(() => {
                setYesLogin(isLogin());
				const get_avatar = () => {
					(async () => {
						try {
							let profileAvatar = await getAvatar();
							let display_name = await getDisplayName();
							let room_id = await getRoomIdByName('Capstone-HelloWorld');
							let user_ID = await getUserId();
							let matrixRoom = await getMatrixRooms();
		
							setUserId(user_ID);
							setDisplayName(display_name);
							setRoomID(room_id);
							setRoomList(matrixRoom);
		
							if (profileAvatar === null || profileAvatar === '') {
								setAvatar(null);
							} else {
								setAvatar(profileAvatar);
							}
						} catch (e) {
							console.log('error', e);
							setAvatar(null);
							setUserId(null);
							setDisplayName(null);
							setRoomID(null);
							setRoomList(null);
						}
					})();
				};
		
				get_avatar();
            }, 500);
        })();

       
    }, [avatar, getAvatar, isLogin,getDisplayName, getMatrixRooms, getRoomIdByName, getUserId]);

    return (
        <>
            {yesLogin ? (
                <div className="App">
                    <TopNavigationBar />
                    {avatar ? (
                        <ProfileView
                            avatar={avatar}
                            userID={userID}
                            displayName={displayName}
                            roomID={roomID}
                            roomList={roomList}
                        />
                    ) : (
                        <ProfileView
                            avatar={'logo_profile_static_avatar.svg'}
                            userID={userID}
                            displayName={displayName}
                            roomID={roomID}
                            roomList={roomList}
                        />
                    )}
                </div>
            ) : (
                <Page403 />
            )}
        </>
    );
};

export default Profile;
