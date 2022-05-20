import {
    useState,
    useEffect,
    Fragment
} from 'react';
import useMatrixClient from '../hooks/useMatrixClient';
import TopNavigationBar from '../components/TopNavigationBar';
import Page403 from './Page403';
import {
    Menu,
    Transition
} from '@headlessui/react'
import {
    useHistory
} from "react-router-dom";

import {
    ChevronDownIcon,
    OfficeBuildingIcon,
    DocumentAddIcon,
    DocumentRemoveIcon,
    ExclamationCircleIcon,
    IdentificationIcon,
    LogoutIcon,
    ShieldCheckIcon,
    EyeIcon,
    PencilIcon,
} from '@heroicons/react/outline';
import { HomeIcon } from '@heroicons/react/solid';

// const bg_gradient = " bg-gradient-to-r from-orange-400 to-rose-400 hover:bg-orange-200 ";

const ProfileView = ({
    avatar,
    userID,
    displayName,
    roomID,
    roomList,
    peopleList,
    leaveRoom,
    forgetRoom,
    inviteUserToRoom,
    kickUserFromRoom,
    banUserFromRoom,
    unbanUserFromRoom,
    roomName
}) => {
    const [viewProfile, setViewProfile] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [changeName, setShowChangeName] = useState(false);
    const [isLeave, setAlertLeaveRoom] = useState(false);
    const [inviteUser, setInviteUser] = useState(false);
    const [kickUser, setKickUser] = useState(false);
    const [changePass, setChangePass] = useState(false);
    const [newName, setChangeName] = useState(null);
    const [userName, setUserName] = useState(null);
    const [userNameKick, setUserNameKick] = useState(null);
    const [banUser, setBanUser] = useState(null);
    const [unBanUser, setUnbanUser] = useState(null);
    const [userNameBan, setUserBan] = useState(null);
    const [unBanUserName, setUnBanUserName] = useState(null);
    const [reason, setReasonKick] = useState(null);
    

    const {
        setAvatar,
        setDisplayName,
        setAvatar2
    } = useMatrixClient();

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

    const handleLeaveRoom = async (e) => {
        leaveRoom(e);
        forgetRoom(e);
    }

    const handleInviteUser = async (e, e2) => {
        inviteUserToRoom(e, e2);
    }

    const handleKickUser = async (e, e2, e3) => {
        kickUserFromRoom(e, e2, e3);
    }

    const handleBanUser = async (e, e2, e3) => {
        banUserFromRoom(e, e2, e3);
    }

    const handleUnbanUser = async (e, e2) => {
        unbanUserFromRoom(e, e2);
    }

    const listMembers = (members) => {
        const items = [];
        for(let element of members){
            items.push(          
                
                    <li className="" key={element.name}>
                        <button
                            className="w-full rounded-t text-xs bg-gray-200 hover:bg-rose-400  hover:text-white py-2 px-4 block whitespace-no-wrap"
                            type="button">
                            {element.name}
                        </button>
                    </li>
                
            )
        }   
        return (
            <ul className="absolute hidden text-gray-700 pt-1 group-hover:block">
                {items}
            </ul>
        )     
    }


    const listItems = roomList.map((number, index) =>
        <div className="w-full px-2" key={index}>
            <div className="z=50 hover:z-50 shadow-md px-4 py-6 w-full bg-white dark:bg-gray-700 relative hover:scale-110 duration-200">
                <p className="p-2 text-rose-400 text-l w-max text-gray-700 dark:text-white font-semibold border-b border-gray-200">
                    {number.name}           
                </p>
                <div className="flex items-end my-4 ">
                    <div className="group inline-block relative">
                        <div className= {`"p-2 text-xs dark:text-white font-bold hover:text-rose-400"`} >
                             People: {number.getMembers().length}  
                        </div>
                        {listMembers(number.getMembers())}
                    </div>

                    <span className="absolute px-2 top-2 right-1">
                        <HomeIcon
                            className="mx-1 h-7 w-7 text-rose-400"
                            aria-hidden="true"
                            stroke="currentColor" strokeWidth="2"
                        />
                    </span>
                </div>        
             </div> 
         </div>
    );

   

    return (
        <>
            <main className="profile-page">
                <section
                    className="relative block"
                    style={{ height: '450px' }}
                >
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
                <section className="relative py-10 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
                            <div className="px-6">
                                <div className="flex flex-wrap justify-center">
                                    <div className="w-full lg:w-4/12 px-4 lg:order-1">
                                    </div>
                                    <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                                        <div className="relative ml-16">

                                            <img
                                                alt="Avatar"
                                                src={avatar}
                                                className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 lg:-ml-16 flex justify-center"
                                                style={{ maxWidth: '150px' }}
                                            />
                                        </div>
                                        
                                        <Menu as="div" className="relative mt-14 mx-4">
                                            <Menu.Button
                                                className="flex flex-wrap items-center justify-center  w-10 h-10 text-gray-700 transition-colors duration-150 bg-yellow-300 rounded-full focus:shadow-outline hover:bg-gray-200 "
                                                type="button"

                                            >
                                                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>
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
                                                        <button
                                                        className={`${
                                                            active ? ' bg-gradient-to-r from-orange-400 to-rose-400 text-white duration-200 hover:bg-gradient-to-r hover:from-orange-400 to-rose-400 hover:border-r-4 hover:border-rose-700 hover:text-white hover:font-bold' : 'text-gray-900'
                                                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                                        type="button"
                                                        onClick={() => setViewProfile(true)}
                                                        >
                                                            {active ? (
                                                                <EyeIcon 
                                                                    className="ml-1 mr-1 h-5 w-5 hover:text-white"
                                                                    aria-hidden="true"/>
                                                                ) : (
                                                                <EyeIcon 
                                                                    className="ml-1 mr-1 h-5 w-5 hover:text-white"/>
                                                                )}
                                                        View Profile Picture
                                                        </button>
                                                    )}
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                    {({ active }) => (
                                                        <button
                                                        className={`${
                                                            active ? 'bg-gradient-to-r from-orange-400 to-rose-400 text-white duration-200 hover:bg-gradient-to-r hover:from-orange-400 to-rose-400 hover:border-r-4 hover:border-rose-700 hover:text-white hover:font-bold' : 'text-gray-900'
                                                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                                        type="button"
                                                        onClick={() => setShowModal(true)}
                                                        >
                                                            {active ? (
                                                                <PencilIcon
                                                                    className="ml-1 mr-1 h-5 w-5 hover:text-white"
                                                                    aria-hidden="true"
                                                                />
                                                                ) : (
                                                                    <PencilIcon
                                                                        className="ml-1 mr-1 h-5 w-5 hover:text-white"
                                                                    />
                                                                )}
                                                        Update Profile Picture
                                                        </button>
                                                    )}
                                                    </Menu.Item>
                                                 
                                                </div>
                                                </Menu.Items>
                                            </Transition>

                                        </Menu>
                                        {viewProfile ? (
                                            <>
                                                <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                                                    <div className="relative w-auto my-6 mx-auto min-w-2xl max-w-4xl">
                                                    {/*content*/}
                                                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                                        {/*header*/}
                                                        <div className="mt-4 flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                                            <img className="mr-5 h-12 w-auto" src="icons8-tiger-96.png" alt="Workflow"></img>
                                                            <h3 className="text-3xl font-semibold">
                                                                Profile Picture
                                                            </h3>
                                                        </div>
                                                        {/*body*/}

                                                        <div className="relative m-auto ">
                                                            <img
                                                                alt="Avatar"
                                                                src={avatar}
                                                                style={{ width: '300px' }}
                                                            />
                                                        </div>



                                                        {/*footer*/}
                                                        <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                                        <button
                                                            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                            type="button"
                                                            onClick={() => setViewProfile(false)}
                                                        >
                                                            Close
                                                        </button>

                                                        </div>
                                                    </div>
                                                    </div>
                                                </div>
                                                <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>

                                            </>
                                        ) : null}

                                        {showModal ? (
                                            <>
                                                <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                                                    <div className="relative w-auto my-6 mx-auto max-w-3xl">
                                                    {/*content*/}
                                                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                                        {/*header*/}
                                                        <div className="mt-4 flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                                            <img className="mr-5 h-12 w-auto" src="icons8-tiger-96.png" alt="Workflow"></img>
                                                            <h3 className="text-3xl font-semibold">
                                                                Edit Avatar
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
                                                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Change Picture</label>
                                                            <input type={'file'}  id={'imagetest'} accept={'*'} ></input>
                                                            <div id= {"display-image"}></div>
                                                        </div>
                                                        <div className="relative p-6 flex-auto mb-6">
                                                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remove Picture</label>
                                                            <button
                                                                className="h-10 w-100 px-5 text-yellow-400 duration-150 border-2 border-yellow-400 rounded-lg focus:shadow-outline hover:bg-yellow-400 hover:text-white"
                                                                type="button"
                                                                onClick={() => setAvatar2('logo_profile_static_avatar.svg')}
                                                                >
                                                                    Remove Picture
                                                                </button>
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
                                                            <img className="mr-5 h-12 w-auto" src="icons8-tiger-96.png" alt="Workflow"></img>
                                                            <h3 className="text-3xl font-semibold">
                                                                Change Name
                                                            </h3>

                                                        </div>
                                                            {/*body*/}

                                                            <div className="relative p-6 flex-auto">
                                                                <label htmlFor="nameText" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Enter the new User Name: </label>
                                                                <input  className="w-100" type={'text'}  id={'nameText'} onChange={event => setChangeName(event.target.value)}></input>

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

                                        {isLeave ? (
                                                <>
                                                    <div
                                                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                                                    >
                                                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                                                        {/*content*/}
                                                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                                            {/*header*/}
                                                            <div className="mt-4 flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                                            <img className="mr-5 h-12 w-auto" src="icons8-tiger-96.png" alt="Workflow"></img>
                                                            <h3 className="text-3xl font-semibold">
                                                                Leave Room
                                                            </h3>

                                                        </div>
                                                            {/*body*/}

                                                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                                                <strong className="font-bold">Alert! </strong>
                                                                    <span className="flex ">Are you sure to leave room?</span>
                                                                    <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                                                                        <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                                                                    </span>
                                                            </div>


                                                            {/*footer*/}
                                                            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                                            <button
                                                                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                                type="button"
                                                                onClick={() => setAlertLeaveRoom(false)}
                                                            >
                                                                Close
                                                            </button>
                                                            <button
                                                                className="bg-yellow-400 text-white active:bg-yellow-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                                type="button"

                                                                 onClick={() => {handleLeaveRoom(roomID);
                                                                 history.push('/room')}}
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

                                        {inviteUser ? (
                                                <>
                                                    <div
                                                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                                                    >
                                                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                                                        {/*content*/}
                                                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                                            {/*header*/}
                                                            <div className="mt-4 flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                                            <img className="mr-5 h-12 w-auto" src="icons8-tiger-96.png" alt="Workflow"></img>
                                                            <h3 className="text-3xl font-semibold">
                                                                Invite User
                                                            </h3>

                                                        </div>
                                                            {/*body*/}

                                                            <div className="relative p-6 flex-auto">
                                                                <label htmlFor="nameText" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Enter the User Id to invite: </label>
                                                                <input  className="w-100" type={'text'}  id={'nameText'} onChange={event => setUserName(event.target.value)}></input>

                                                            </div>


                                                            {/*footer*/}
                                                            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                                            <button
                                                                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                                type="button"
                                                                onClick={() => setInviteUser(false)}
                                                            >
                                                                Close
                                                            </button>
                                                            <button
                                                                className="bg-yellow-400 text-white active:bg-yellow-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                                type="button"

                                                                onClick={() => {handleInviteUser(userName, roomID); setInviteUser(false)}}
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


                                        {kickUser ? (
                                                <>
                                                    <div
                                                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                                                    >
                                                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                                                        {/*content*/}
                                                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                                            {/*header*/}
                                                            <div className="mt-4 flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                                            <img className="mr-5 h-12 w-auto" src="icons8-tiger-96.png" alt="Workflow"></img>
                                                            <h3 className="text-3xl font-semibold">
                                                                Kick User
                                                            </h3>

                                                        </div>
                                                            {/*body*/}

                                                            <div className="relative p-6 flex-auto">
                                                                <label htmlFor="nameText" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Enter the User Id you want to kick: </label>
                                                                <input  className="w-100" type={'text'}  id={'nameText'} onChange={event => setUserNameKick(event.target.value)}></input>

                                                            </div>

                                                            <div className="relative p-6 flex-auto">
                                                                <label htmlFor="nameText" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Reason: </label>
                                                                <input  className="w-100" type={'text'}  id={'nameText'} onChange={event => setReasonKick(event.target.value)}></input>

                                                            </div>


                                                            {/*footer*/}
                                                            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                                            <button
                                                                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                                type="button"
                                                                onClick={() => setKickUser(false)}
                                                            >
                                                                Close
                                                            </button>
                                                            <button
                                                                className="bg-yellow-400 text-white active:bg-yellow-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                                type="button"

                                                                onClick={() => {handleKickUser(roomID, userNameKick, reason); setKickUser(false)}}
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

                                        {banUser ? (
                                                <>
                                                    <div
                                                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                                                    >
                                                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                                                        {/*content*/}
                                                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                                            {/*header*/}
                                                            <div className="mt-4 flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                                            <img className="mr-5 h-12 w-auto" src="icons8-tiger-96.png" alt="Workflow"></img>
                                                            <h3 className="text-3xl font-semibold">
                                                                Ban User
                                                            </h3>

                                                        </div>
                                                            {/*body*/}

                                                            <div className="relative p-6 flex-auto">
                                                                <label htmlFor="nameText" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Enter the User Id you want to band: </label>
                                                                <input  className="w-100" type={'text'}  id={'nameText'} onChange={event => setUserBan(event.target.value)}></input>

                                                            </div>

                                                            <div className="relative p-6 flex-auto">
                                                                <label htmlFor="nameText" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Reason: </label>
                                                                <input  className="w-100" type={'text'}  id={'nameText'} onChange={event => setReasonKick(event.target.value)}></input>

                                                            </div>


                                                            {/*footer*/}
                                                            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                                            <button
                                                                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                                type="button"
                                                                onClick={() => setBanUser(false)}
                                                            >
                                                                Close
                                                            </button>
                                                            <button
                                                                className="bg-yellow-400 text-white active:bg-yellow-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                                type="button"

                                                                onClick={() => {handleBanUser(roomID, userNameBan, reason); setBanUser(false)}}
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

                                        {unBanUser ? (
                                                <>
                                                    <div
                                                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                                                    >
                                                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                                                        {/*content*/}
                                                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                                            {/*header*/}
                                                            <div className="mt-4 flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                                            <img className="mr-5 h-12 w-auto" src="icons8-tiger-96.png" alt="Workflow"></img>
                                                            <h3 className="text-3xl font-semibold">
                                                                Unban User
                                                            </h3>

                                                        </div>
                                                            {/*body*/}

                                                            <div className="relative p-6 flex-auto">
                                                                <label htmlFor="nameText" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Enter the User Id to unban: </label>
                                                                <input  className="w-100" type={'text'}  id={'nameText'} onChange={event => setUnBanUserName(event.target.value)}></input>

                                                            </div>


                                                            {/*footer*/}
                                                            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                                            <button
                                                                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                                type="button"
                                                                onClick={() => setUnbanUser(false)}
                                                            >
                                                                Close
                                                            </button>
                                                            <button
                                                                className="bg-yellow-400 text-white active:bg-yellow-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                                type="button"

                                                                onClick={() => {handleUnbanUser(roomID, unBanUserName); setUnbanUser(false)}}
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

                                        {changePass ? (
                                                <>
                                                    <div
                                                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                                                    >
                                                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                                                        {/*content*/}
                                                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                                            {/*header*/}
                                                            <div className="mt-4 flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                                            <img className="mr-5 h-12 w-auto" src="icons8-tiger-96.png" alt="Workflow"></img>
                                                            <h3 className="text-3xl font-semibold">
                                                                Edit Pasword
                                                            </h3>

                                                        </div>
                                                            {/*body*/}

                                                            <div className="relative p-6 flex-auto">
                                                                <label htmlFor="nameText" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Enter your current password: </label>
                                                                <input  className="w-100" type={'password'}  id={'nameText'} onChange={event => setChangeName(event.target.value)}></input>
                                                            </div>

                                                            <div className="relative p-6 flex-auto">
                                                                <label htmlFor="nameText" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Enter your new password: </label>
                                                                <input  className="w-100" type={'password'}  id={'nameText'} onChange={event => setChangeName(event.target.value)}></input>
                                                            </div>


                                                            {/*footer*/}
                                                            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                                            <button
                                                                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                                type="button"
                                                                onClick={() => setChangePass(false)}
                                                            >
                                                                Close
                                                            </button>
                                                            <button
                                                                className="bg-yellow-400 text-white active:bg-yellow-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                                type="button"

                                                                onClick={() => { setChangePass(false)}}
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
                                    <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center ">
                                        <div className="py-6 px-3 mt-32 sm:mt-0 hidden lg:block">
                                            <Menu as="div" className="relative mx-4">
                                            <Menu.Button
                                                className="w-1/2 justify-center inline-flex items-center px-3 py-2 border border-orange-300 rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-400 to-rose-400 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500" 
                                                type="button"
                                            >
                                                Setting
                                                <ChevronDownIcon
                                                    className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
                                                    aria-hidden="true"
                                                />
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
                                                <Menu.Items className="z-20 origin-top-right absolute right-0 mt-2 w-30 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                <div className="py-1">
                                                        <Menu.Item>
                                                            <button className="w-full flex items-center pl-6 p-2 my-1 duration-200 justify-start hover:bg-gradient-to-r hover:from-orange-400 to-rose-400 hover:border-r-4 hover:border-rose-700 hover:text-white hover:font-bold"
                                                                    type="button"
                                                                    onClick={() => setShowChangeName(true)}>
                                                                <div className="text-left hover:text-white">
                                                                <IdentificationIcon
                                                                    className="ml-1 mr-1 h-5 w-5 hover:text-white"
                                                                    aria-hidden="true"
                                                                />
                                                                </div>
                                                                <span className="mx-4 text-sm font-normal">
                                                                    Change Name
                                                                </span>
                                                            </button>                    
                                                        </Menu.Item>
                                                    
                                                        <Menu.Item>
                                                            <button className="w-full flex items-center pl-6 p-2 my-1 duration-200 justify-start hover:bg-gradient-to-r hover:from-orange-400 to-rose-400 hover:border-r-4 hover:border-rose-700 hover:text-white hover:font-bold"
                                                                    type="button"
                                                                    onClick={() => setInviteUser(true)}>
                                                                <span className="text-left">
                                                                <DocumentAddIcon
                                                                    className="ml-1 mr-1 h-5 w-5 hover:text-white"
                                                                    aria-hidden="true"
                                                                />
                                                                </span>
                                                                <span className="mx-4 text-sm font-normal">
                                                                    Invite User
                                                                </span>
                                                            </button>               
                                                        </Menu.Item>
                                                        <Menu.Item>
                                                            <button className="w-full flex items-center pl-6 p-2 my-1 duration-200 justify-start hover:bg-gradient-to-r hover:from-orange-400 to-rose-400 hover:border-r-4 hover:border-rose-700 hover:text-white hover:font-bold"
                                                                    type="button"
                                                                    onClick={() => setKickUser(true)}>
                                                                <span className="text-left">
                                                                    <DocumentRemoveIcon
                                                                        className="ml-1 mr-1 h-5 w-5 hover:text-white"
                                                                        aria-hidden="true"
                                                                    />
                                                                </span>
                                                                <span className="mx-4 text-sm font-normal">
                                                                    Kick Users
                                                                </span>
                                                            </button>
                                                        </Menu.Item>
                                                        <Menu.Item>
                                                            <button className="w-full flex items-center pl-6 p-2 my-1 duration-200 justify-start hover:bg-gradient-to-r hover:from-orange-400 to-rose-400 hover:border-r-4 hover:border-rose-700 hover:text-white hover:font-bold"
                                                                    type="button"
                                                                    onClick={() => setBanUser(true)}>
                                                                <span className="text-left">
                                                                    <ExclamationCircleIcon
                                                                        className="ml-1 mr-1 h-5 w-5 hover:text-white"
                                                                        aria-hidden="true"
                                                                    />
                                                                </span>
                                                                <span className="mx-4 text-sm font-normal">
                                                                    Ban Users
                                                                </span>
                                                            </button>
                                                        </Menu.Item>
                                                        <Menu.Item>
                                                            <button className="w-full flex items-center pl-6 p-2 my-1 duration-200 justify-start hover:bg-gradient-to-r hover:from-orange-400 to-rose-400 hover:border-r-4 hover:border-rose-700 hover:text-white hover:font-bold"
                                                                    type="button"
                                                                    onClick={() => setUnbanUser(true)}>
                                                                <span className="text-left">
                                                                    <ShieldCheckIcon
                                                                        className="ml-1 mr-1 h-5 w-5 hover:text-white"
                                                                        aria-hidden="true"
                                                                    />
                                                                </span>
                                                                <span className="mx-4 text-sm font-normal">
                                                                    Unban Users
                                                                </span>
                                                            </button>
                                                        </Menu.Item>
                                                        <Menu.Item>
                                                            <button className="w-full flex items-center pl-6 p-2 my-1 duration-200 justify-start hover:bg-gradient-to-r hover:from-orange-400 to-rose-400 hover:border-r-4 hover:border-rose-700 hover:text-white hover:font-bold"
                                                                    type="button"
                                                                    onClick={() => setAlertLeaveRoom(true)}>
                                                                <span className="text-left">
                                                                    <LogoutIcon
                                                                        className="ml-1 mr-1 h-5 w-5 hover:text-white"
                                                                        aria-hidden="true"
                                                                    />
                                                                </span>
                                                                <span className="mx-4 text-sm font-normal">
                                                                    Leave Room
                                                                </span>
                                                            </button>
                                                        </Menu.Item>

                                                    
                                                </div>
                                                    </Menu.Items>
                                            </Transition>

                                        </Menu>
                                         </div>
                                    </div>
                                </div>
                               
                                <div className="text-center mt-6">               
                                    <h3 className="text-4xl font-semibold leading-normal text-gray-800 flex items-center justify-center pt-2">
                                                    {displayName}
                                    </h3>
                                </div> 
                                                
                                
                                    <div className="flex items-start justify-between">
                                       
                                        <div className="flex flex-col w-full md:space-y-4">
                                            {/* <header className="w-full h-16 z-40 flex items-center justify-between"> */}
                                            <header>
                                                <Menu as ="div" className="block lg:hidden ml-6">
            
                                                    <Menu.Button className="flex p-2 items-center rounded-full bg-white shadow text-gray-500 text-md">
                                                        <svg width="20" height="20" className="text-gray-400" fill="currentColor" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M1664 1344v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45z">
                                                            </path>
                                                        </svg>
                                                    </Menu.Button>
                                                    
                        
                                                    <Menu.Items className="z-10 origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                    <div className="py-1">
                                                    <Menu.Item>
                                                            <button className="w-full flex items-center pl-6 p-2 my-1 duration-200 justify-start hover:bg-gradient-to-r hover:from-orange-400 to-rose-400 hover:border-r-4 hover:border-rose-700 hover:text-white hover:font-bold"
                                                                    type="button"
                                                                    onClick={() => setShowChangeName(true)}>
                                                                <div className="text-left hover:text-white">
                                                                <IdentificationIcon
                                                                    className="ml-1 mr-1 h-5 w-5 hover:text-white"
                                                                    aria-hidden="true"
                                                                />
                                                                </div>
                                                                <span className="mx-4 text-sm font-normal">
                                                                    Change Name
                                                                </span>
                                                            </button>                    
                                                        </Menu.Item>
                                                    
                                                        <Menu.Item>
                                                            <button className="w-full flex items-center pl-6 p-2 my-1 duration-200 justify-start hover:bg-gradient-to-r hover:from-orange-400 to-rose-400 hover:border-r-4 hover:border-rose-700 hover:text-white hover:font-bold"
                                                                    type="button"
                                                                    onClick={() => setInviteUser(true)}>
                                                                <span className="text-left">
                                                                <DocumentAddIcon
                                                                    className="ml-1 mr-1 h-5 w-5 hover:text-white"
                                                                    aria-hidden="true"
                                                                />
                                                                </span>
                                                                <span className="mx-4 text-sm font-normal">
                                                                    Invite User
                                                                </span>
                                                            </button>               
                                                        </Menu.Item>
                                                        <Menu.Item>
                                                            <button className="w-full flex items-center pl-6 p-2 my-1 duration-200 justify-start hover:bg-gradient-to-r hover:from-orange-400 to-rose-400 hover:border-r-4 hover:border-rose-700 hover:text-white hover:font-bold"
                                                                    type="button"
                                                                    onClick={() => setKickUser(true)}>
                                                                <span className="text-left">
                                                                    <DocumentRemoveIcon
                                                                        className="ml-1 mr-1 h-5 w-5 hover:text-white"
                                                                        aria-hidden="true"
                                                                    />
                                                                </span>
                                                                <span className="mx-4 text-sm font-normal">
                                                                    Kick Users
                                                                </span>
                                                            </button>
                                                        </Menu.Item>
                                                        <Menu.Item>
                                                            <button className="w-full flex items-center pl-6 p-2 my-1 duration-200 justify-start hover:bg-gradient-to-r hover:from-orange-400 to-rose-400 hover:border-r-4 hover:border-rose-700 hover:text-white hover:font-bold"
                                                                    type="button"
                                                                    onClick={() => setBanUser(true)}>
                                                                <span className="text-left">
                                                                    <ExclamationCircleIcon
                                                                        className="ml-1 mr-1 h-5 w-5 hover:text-white"
                                                                        aria-hidden="true"
                                                                    />
                                                                </span>
                                                                <span className="mx-4 text-sm font-normal">
                                                                    Ban Users
                                                                </span>
                                                            </button>
                                                        </Menu.Item>
                                                        <Menu.Item>
                                                            <button className="w-full flex items-center pl-6 p-2 my-1 duration-200 justify-start hover:bg-gradient-to-r hover:from-orange-400 to-rose-400 hover:border-r-4 hover:border-rose-700 hover:text-white hover:font-bold"
                                                                    type="button"
                                                                    onClick={() => setUnbanUser(true)}>
                                                                <span className="text-left">
                                                                    <ShieldCheckIcon
                                                                        className="ml-1 mr-1 h-5 w-5 hover:text-white"
                                                                        aria-hidden="true"
                                                                    />
                                                                </span>
                                                                <span className="mx-4 text-sm font-normal">
                                                                    Unban Users
                                                                </span>
                                                            </button>
                                                        </Menu.Item>
                                                        <Menu.Item>
                                                            <button className="w-full flex items-center pl-6 p-2 my-1 duration-200 justify-start hover:bg-gradient-to-r hover:from-orange-400 to-rose-400 hover:border-r-4 hover:border-rose-700 hover:text-white hover:font-bold"
                                                                    type="button"
                                                                    onClick={() => setAlertLeaveRoom(true)}>
                                                                <span className="text-left">
                                                                    <LogoutIcon
                                                                        className="ml-1 mr-1 h-5 w-5 hover:text-white"
                                                                        aria-hidden="true"
                                                                    />
                                                                </span>
                                                                <span className="mx-4 text-sm font-normal">
                                                                    Leave Room
                                                                </span>
                                                            </button>
                                                        </Menu.Item>
                                                    
                                                    </div>
                                                    </Menu.Items>
                                                </Menu>
                                            </header>
                                            

                                            <div className="overflow-auto pb-24 px-4 md:px-6 my-5 pt-5">
                                                            <h1 className="text-4xl font-semibold text-gray-800 dark:text-white">
                                                                Welcome, {displayName}
                                                            </h1>
                                                            <h2 className="text-sm text-gray-400">
                                                                Here is the detail of your account
                                                            </h2>
                                                        
                                                            <div className="z-0 flex my-6 items-center w-full space-y-4 md:space-x-4 md:space-y-0 flex-col md:flex-row">
                                                                <div className="w-full md:w-5/12 mx-6" >
                                                                    <div className="shadow-md w-full bg-white dark:bg-gray-700 relative overflow-hidden hover:scale-110 duration-200">
                                                                        <div className="w-full h-full block">
                                                                            <button className="flex items-center justify-between px-4 py-6 space-x-4 ">
                                                                                <div className="flex items-center ">
                                                    
                                                                                    <p className="text-md text-rose-400 dark:text-white ml-2 font-semibold border-b border-gray-200 ">
                                                                                        Current Room
                                                                                    </p>
                                                                                </div>
                                                                                <div className="border-b border-gray-200 mt-6 md:mt-0 text-black dark:text-white font-bold text-md">

                                                                                    <span className="text-sm text-black dark:text-white font-bold">
                                                                                        {roomName}
                                                                                    </span>
                                                                                </div>
                                                                            </button>
                                                                        
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center w-full md:w-1/2 space-x-4">
                                                                <div className="w-1/2 ">
                                                                    <button className="shadow-md px-4 py-6 w-full bg-white dark:bg-gray-700 relative hover:scale-110 duration-300">
                                                                        <p className="text-rose-400 text-md font-semibold">
                                                                            User ID
                                                                        </p>
                                                                        <p className="text-sm text-black dark:text-white font-bold ">
                                                                            {userID}
                                                                        </p>
                                                                    </button>
                                                                </div>
                                                                <div className="w-1/2">
                                                                    <div className="shadow-md px-4 py-6 w-full bg-white dark:bg-gray-700 relative hover:scale-110 duration-300">
                                                                        <p className="text-rose-400 text-md font-semibold">
                                                                            People
                                                                        </p>
                                                                        <p className="text-lg text-black dark:text-white font-bold">
                                                                            {peopleList}
                                                                        </p>
                                                                        
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        
                                                        </div>
                                                        <div className="flex items-center space-x-4">
                                                        
                                                                <span className="text-lg text-gray-400">
                                                                    Current Room List:
                                                                </span>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 my-10">
                                                            {listItems}
                                                        </div> 
                                                        <button
                                                            type="button"
                                                            onClick={() => history.push('/room')}
                                                            className="w-1/7 justify-center inline-flex items-center px-3 py-2 border border-orange-300 rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-400 to-rose-400 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                                        >
                                                            <OfficeBuildingIcon
                                                                className="-ml-1 mr-2 h-5 w-5 text-white"
                                                                aria-hidden="true"
                                                            />
                                                            Change Room
                                                        </button>
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
        leaveRoom,
        forgetRoom,
        inviteUserToRoom,
        kickUserFromRoom,
        banUserFromRoom,
        unbanUserFromRoom,
        getRoomNameById,
        getListPeopleById,
    } = useMatrixClient();
    const [yesLogin, setYesLogin] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [userID, setUserId] = useState(null);
    const [displayName, setDisplayName] = useState(null);
    const [roomID, setRoomID] = useState(null);
    const [roomList, setRoomList] = useState([]);
    const [peopleList, setPeopleList] = useState(null);
    const [roomName, setRoomName] = useState(null);

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
							let room_id = localStorage.getItem("currentRoomID");
							let user_ID = await getUserId();
							let matrixRoom = await getMatrixRooms();
                            let room_name = await getRoomNameById(room_id);
                            let people_list = await getListPeopleById(room_id);

							setUserId(user_ID);
							setDisplayName(display_name);
							setRoomID(room_id);
							setRoomList(matrixRoom);
                            setRoomName(room_name);
                            setPeopleList(people_list);

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
                            setRoomName(null);
                            setPeopleList(null);
						}
					})();
				};

				get_avatar();
            }, 500);
        })();


    }, [avatar, getAvatar, isLogin,getDisplayName, getMatrixRooms, getRoomIdByName, getUserId, testLogin, getRoomNameById, getListPeopleById]);

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
                            peopleList={peopleList}
                            leaveRoom = {leaveRoom}
                            forgetRoom = {forgetRoom}
                            inviteUserToRoom={inviteUserToRoom}
                            kickUserFromRoom={kickUserFromRoom}
                            banUserFromRoom={banUserFromRoom}
                            unbanUserFromRoom={unbanUserFromRoom}
                            roomName = {roomName}
                        />
                    ) : (
                        <ProfileView
                            avatar={'logo_profile_static_avatar.svg'}
                            userID={userID}
                            displayName={displayName}
                            roomID={roomID}
                            roomList={roomList}
                            peopleList={peopleList}
                            leaveRoom = {leaveRoom}
                            forgetRoom = {forgetRoom}
                            inviteUserToRoom={inviteUserToRoom}
                            kickUserFromRoom={kickUserFromRoom}
                            banUserFromRoom={banUserFromRoom}
                            unbanUserFromRoom={unbanUserFromRoom}
                            roomName = {roomName}
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
