
import { useState, useEffect } from 'react';
import useMatrixClient from '../hooks/useMatrixClient';
import TopNavigationBar from '../components/TopNavigationBar';
import Page403 from './Page403';
import { useHistory } from "react-router-dom";


const RoomPage = ({roomList, avarta, displayName}) => {
    const history = useHistory();
    const listItems = roomList.map((number) =>
    <li class="border-gray-400 flex flex-row mb-4" onClick={() => history.push('/homepage')}>
										<div
											class="select-none flex flex-1 items-center p-4 transition duration-500 ease-in-out transform hover:-translate-y-2 rounded-2xl border-2 p-6 hover:shadow-2xl border-yellow-400"
										>
											<div class="flex-1 pl-1 mr-16">
												<div class="font-medium">
													{number.name}
												</div>
											</div>
											<div
												class="w-1/4 text-wrap text-center flex text-white text-bold flex-col rounded-md bg-yellow-400 justify-center items-center mr-10 p-2"
											>
												Join
											</div>
										</div>
									</li>
);
    return(
        <>
        
                        
                            <div className="px-6 mt-5">
                                <div className="flex flex-wrap justify-center mt-5">
                                        <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center mt-5">
                                            <div className="relative">
                                                <img
                                                    alt="..."
                                                    src={avarta}
                                                    className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16"
                                                    style={{ maxWidth: '150px' }}
                                                />
                                            </div>
                                        </div>
                                </div>
                            </div>
                            <div className="text-center mt-12">
                            <h3 className="text-4xl font-semibold leading-normal mb-2 text-gray-800 pt-5">
                                        {displayName}
                                    </h3>
                            </div>
                            
                            

                            <div class="container mt-5 flex mx-auto w-full items-center justify-center">
                          
								<ul class="flex flex-col p-4">
                                    {listItems}
								</ul>
							</div>

                            <div class="container flex mx-auto w-full items-center justify-center">
                                 <button class="py-2 px-4 text-yellow-400 font-semibold border-2 p-6 border-yellow-400 rounded hover:bg-yellow-400 hover:text-white hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0">
                                    Create New Room
                                </button>
                            </div>
                           
                            </>
    );
};

const RoomSelect = () => {
    const {
        isLogin,
        testLogin,
        getAvatar,
        getRoomIdByName,
        getDisplayName,
        getMatrixRooms,
    } = useMatrixClient();
    const [yesLogin, setYesLogin] = useState(false);
    const [roomID, setRoomID] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [roomList, setRoomList] = useState([]);
    const [displayName, setDisplayName] = useState(null);

    useEffect(() => {
        (async () => {
            if (isLogin() === false) {
                console.log('Run test login');
                setYesLogin(await testLogin());
            }
            setTimeout(() => {
                setYesLogin(isLogin());
				const get_room = () => {
					(async () => {
						try {
							let room_id = await getRoomIdByName('Capstone-HelloWorld');
							let matrixRoom = await getMatrixRooms();
                            let profileAvatar = await getAvatar();
                            let display_name = await getDisplayName();
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
                            setDisplayName(null);
                            setAvatar(null);
							setRoomID(null);
							setRoomList(null);
						}
					})();
				};
		
				get_room();
            }, 500);
        })();

    }, [avatar, getAvatar, getMatrixRooms, isLogin, testLogin]);

    return (
        <>
            {yesLogin ? (
                <div className="App">
                    {avatar ? (
                    <RoomPage 
                        roomList={roomList}
                        avarta={avatar}
                        displayName={displayName}
                    />
                ) : (
                    <RoomPage 
                    roomList={roomList}
                    avarta={'logo_profile_static_avatar.svg'}
                    displayName={displayName}
                />
                )}
                   
                </div>
            ) : (
                <Page403 />
            )}
        </>
    );
};



export default RoomSelect;