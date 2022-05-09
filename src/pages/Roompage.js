import { React, useState, useEffect } from 'react';
import useMatrixClient from '../hooks/useMatrixClient';
import Page403 from './Page403';
import { useHistory } from 'react-router-dom';

export var currentRoomID = null;
export const setCurrentRoomID = (roomID) =>{
    currentRoomID = roomID;
}

const RoomPage = ({
    roomList,
    avarta,
    displayName,
    createRoom,
    getHistory,
}) => {
    const [showModal, setShowModal] = useState(false);
    const [roomName, setRoomName] = useState(null);
    const history = useHistory();
    //  const { createRoom, inviteUserToRoom } = useMatrixClient();

    useEffect(() => {
        console.log('ROOM LIST: ', roomList);
    }, [roomList]);

    const handleCreateRoom = async (e) => {
        // e.preventDefault();
        const roomID = await createRoom(roomName);
        console.log('Create Room successfully', roomID);
        // const deviceID = await inviteUserToRoom(
        //    '@test003:pdxinfosec.org',
        //     roomID
        //  );
        // console.log('\n\n test devices:', deviceID);
    };

    const listItems = roomList.map((number, index) => (
        <li
            className="border-gray-400 flex flex-row mb-4"
            onClick={() => {
                currentRoomID = number;
                history.push('/homepage');
                getHistory(number.roomId, 20);
                localStorage.setItem('currentRoomID',number.roomId);
            }}
            key={index}
        >
            <div className="select-none flex flex-1 items-center p-4 transition duration-500 ease-in-out transform hover:-translate-y-2 rounded-2xl border-2 p-6 hover:shadow-2xl border-yellow-400">
                <div className="flex-1 pl-1 mr-16">
                    <div className="font-medium">{number.name}</div>
                </div>
                <div className="w-20 text-wrap text-center flex text-white text-bold flex-col rounded-md bg-yellow-400 justify-center items-center ml-10 p-2">
                    Join
                </div>
            </div>
        </li>
    ));

    return (
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

            <div className="text-center mt-10">
                <h3 className="text-4xl font-semibold leading-normal mb-2 text-gray-800 pt-5">
                    {displayName}
                </h3>
            </div>

            <div className="container mt-2 flex mx-auto w-full items-center justify-center">
                <ul className="flex flex-col px-2">{listItems}</ul>
            </div>

            <div className="container flex mx-auto w-full items-center justify-center">
                <button
                    className="mb-20 py-2 px-4 text-yellow-400 font-semibold border-2 p-6 border-yellow-400 rounded hover:bg-yellow-400 hover:text-white hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0"
                    type="button"
                    onClick={() => setShowModal(true)}
                >
                    Create New Room
                </button>
            </div>
            {showModal ? (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {/*header*/}
                                <div className="mt-4 flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                    <img
                                        className="mr-5 h-12 w-auto"
                                        src="icons8-tiger-96.png"
                                        alt="Workflow"
                                    ></img>
                                    <h3 className="text-3xl font-semibold">
                                        Add Room
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

                                <div className="relative p-6 flex-auto">
                                    <label
                                        for="text"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                    >
                                        Room name
                                    </label>
                                    <input
                                        type="text"
                                        id="text"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Enter room name"
                                        required
                                        onChange={(event) =>
                                            setRoomName(event.target.value)
                                        }
                                    ></input>
                                </div>

                                <div className="relative p-6 flex-auto">
                                    <p className="my-4 text-slate-500 text-lg leading-relaxed">
                                        I always felt like I could do anything.
                                        That’s the main thing people are
                                        controlled by! Thoughts- their
                                        perception of themselves! They're slowed
                                        down by their perception of themselves.
                                        If you're taught you can’t do anything,
                                        you won’t do anything. I was taught I
                                        could do everything.
                                    </p>
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
                                        onClick={() => {
                                            handleCreateRoom(roomName);
                                            setShowModal(false);
                                        }}
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
        </>
    );
};

const RoomSelect = () => {
    const {
        isLogin,
        testLogin,
        getAvatar,
        // getRoomIdByName,
        getDisplayName,
        getMatrixRooms,
        createRoom,
        getHistory,
    } = useMatrixClient();
    const [yesLogin, setYesLogin] = useState(false);
    // const [roomID, setRoomID] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [roomList, setRoomList] = useState([]);
    const [displayName, setDisplayName] = useState(null);

    useEffect(() => {
        (async () => {
            if (isLogin() === false) {
                await testLogin();
            }
            setTimeout(() => {
                setYesLogin(isLogin());
                const get_room = () => {
                    (async () => {
                        try {
                            // let room_id = await getRoomIdByName('Capstone-HelloWorld');
                            let matrixRoom = await getMatrixRooms();

                            let profileAvatar = await getAvatar();
                            let display_name = await getDisplayName();
                            setDisplayName(display_name);
                            // setRoomID(room_id);
                            setRoomList(matrixRoom);

                            if (
                                profileAvatar === null ||
                                profileAvatar === ''
                            ) {
                                setAvatar(null);
                            } else {
                                setAvatar(profileAvatar);
                            }
                        } catch (e) {
                            console.log('error', e);
                            setDisplayName(null);
                            setAvatar(null);
                            // setRoomID(null);
                            setRoomList(null);
                        }
                    })();
                };

                get_room();
            }, 500);
        })();
    }, [avatar, getAvatar, getDisplayName, getMatrixRooms, isLogin, testLogin]);

    return (
        <>
            {yesLogin ? (
                <div className="App">
                    {avatar ? (
                        <RoomPage
                            roomList={roomList}
                            avarta={avatar}
                            displayName={displayName}
                            createRoom={createRoom}
                            getHistory={getHistory}
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
