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

import { ChevronDownIcon } from '@heroicons/react/solid'
import { FcBusinessman, FcUnlock, FcPlus, FcMinus, FcCancel, FcImport, FcDataBackup, FcServices, FcHome, FcDepartment } from 'react-icons/fc'


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function ViewActiveIcon(props) {
    return (
      <svg
        {...props}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10,6.978c-1.666,0-3.022,1.356-3.022,3.022S8.334,13.022,10,13.022s3.022-1.356,3.022-3.022S11.666,6.978,10,6.978M10,12.267c-1.25,0-2.267-1.017-2.267-2.267c0-1.25,1.016-2.267,2.267-2.267c1.251,0,2.267,1.016,2.267,2.267C12.267,11.25,11.251,12.267,10,12.267 M18.391,9.733l-1.624-1.639C14.966,6.279,12.563,5.278,10,5.278S5.034,6.279,3.234,8.094L1.609,9.733c-0.146,0.147-0.146,0.386,0,0.533l1.625,1.639c1.8,1.815,4.203,2.816,6.766,2.816s4.966-1.001,6.767-2.816l1.624-1.639C18.536,10.119,18.536,9.881,18.391,9.733 M16.229,11.373c-1.656,1.672-3.868,2.594-6.229,2.594s-4.573-0.922-6.23-2.594L2.41,10l1.36-1.374C5.427,6.955,7.639,6.033,10,6.033s4.573,0.922,6.229,2.593L17.59,10L16.229,11.373z"
          fill="white"
          stroke="yellow-400"
          strokeWidth="2"
        />
      </svg>
    )
  }

  function ViewInactiveIcon(props) {
    return (
      <svg
        {...props}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10,6.978c-1.666,0-3.022,1.356-3.022,3.022S8.334,13.022,10,13.022s3.022-1.356,3.022-3.022S11.666,6.978,10,6.978M10,12.267c-1.25,0-2.267-1.017-2.267-2.267c0-1.25,1.016-2.267,2.267-2.267c1.251,0,2.267,1.016,2.267,2.267C12.267,11.25,11.251,12.267,10,12.267 M18.391,9.733l-1.624-1.639C14.966,6.279,12.563,5.278,10,5.278S5.034,6.279,3.234,8.094L1.609,9.733c-0.146,0.147-0.146,0.386,0,0.533l1.625,1.639c1.8,1.815,4.203,2.816,6.766,2.816s4.966-1.001,6.767-2.816l1.624-1.639C18.536,10.119,18.536,9.881,18.391,9.733 M16.229,11.373c-1.656,1.672-3.868,2.594-6.229,2.594s-4.573-0.922-6.23-2.594L2.41,10l1.36-1.374C5.427,6.955,7.639,6.033,10,6.033s4.573,0.922,6.229,2.593L17.59,10L16.229,11.373z"
          fill="white"
          stroke="#f2b400"
          strokeWidth="1"
        />
      </svg>
    )
  }

  function EditInactiveIcon(props) {
    return (
      <svg
        {...props}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 13V16H7L16 7L13 4L4 13Z"
          fill="white"
          stroke="#f2b400"
          strokeWidth="2"
        />
      </svg>
    )
  }

  function EditActiveIcon(props) {
    return (
      <svg
        {...props}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 13V16H7L16 7L13 4L4 13Z"
          fill="yellow-400"
          stroke="white"
          strokeWidth="1"
        />
      </svg>
    )
  }

const ProfileView = ({
    avatar,
    userID,
    displayName,
    roomID,
    roomList,
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

    const listItems = roomList.map((number, index) =>
        <div class="w-full">
            <div class="shadow-lg px-4 py-6 w-full bg-white dark:bg-gray-700 relative hover:scale-110 duration-200">
                <p key={index} class="text-yellow-500 text-xl w-max text-gray-700 dark:text-white font-semibold border-b border-gray-200">
                    {number.name}           
                </p>
                <div class="flex items-end my-4 ">
                    <p class="text-xs text-black dark:text-white font-bold">
                        Room ID: {number.roomId} 
                    </p>
                    <span class="absolute px-2 top-2 right-1">
                        <FcHome size={30}/>
                    </span>
                </div>
                {/* <div class="flex items-end my-4 text-sm font-bold flex items-left">
                        {number.roomId}
                </div> */}
            </div>
            {/* <li key={index}>
                {number.name}
            </li> */}
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
                                                className="flex flex-wrap items-center justify-center  w-10 h-10 text-gray-700 transition-colors duration-150 bg-yellow-300 rounded-full focus:shadow-outline hover:bg-gray-200"
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
                                                            active ? 'bg-yellow-400 text-white' : 'text-gray-900'
                                                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                                        type="button"
                                                        onClick={() => setViewProfile(true)}
                                                        >
                                                            {active ? (
                                                                <ViewActiveIcon
                                                                    className="mr-2 h-5 w-5"
                                                                    aria-hidden="true"
                                                                />
                                                                ) : (
                                                                <ViewInactiveIcon
                                                                    className="mr-2 h-5 w-5"
                                                                    aria-hidden="true"
                                                                />
                                                                )}
                                                        View Profile Picture
                                                        </button>
                                                    )}
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                    {({ active }) => (
                                                        <button
                                                        className={`${
                                                            active ? 'bg-yellow-400 text-white' : 'text-gray-900'
                                                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                                        type="button"
                                                        onClick={() => setShowModal(true)}
                                                        >
                                                            {active ? (
                                                                <EditActiveIcon
                                                                    className="mr-2 h-5 w-5"
                                                                    aria-hidden="true"
                                                                />
                                                                ) : (
                                                                <EditInactiveIcon
                                                                    className="mr-2 h-5 w-5"
                                                                    aria-hidden="true"
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

                                </div>

                                <h3 className="text-4xl font-semibold leading-normal text-gray-800 flex items-center justify-center pt-2">
                                                {displayName}
                                </h3>

                                <div className="bg-gray-100 dark:bg-gray-800 h-full relative mt-10 mb-2">
                                    <div className="flex items-start justify-between">
                                        <div className="h-screen hidden lg:block shadow-lg relative w-80">
                                            <div className="bg-white h-full dark:bg-gray-700">
                                                <div className="flex items-center justify-start pt-6 ml-8">
                                                    <span className="text-left">
                                                                {/* <svg width="20" height="20" fill="currentColor" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M1472 992v480q0 26-19 45t-45 19h-384v-384h-256v384h-384q-26 0-45-19t-19-45v-480q0-1 .5-3t.5-3l575-474 575 474q1 2 1 6zm223-69l-62 74q-8 9-21 11h-3q-13 0-21-7l-692-577-692 577q-12 8-24 7-13-2-21-11l-62-74q-8-10-7-23.5t11-21.5l719-599q32-26 76-26t76 26l244 204v-195q0-14 9-23t23-9h192q14 0 23 9t9 23v408l219 182q10 8 11 21.5t-7 23.5z">
                                                                    </path>
                                                                </svg> */}
                                                                {/* <img className="h-12" src="configuration-gear-options-svgrepo-com.svg" alt="Workflow"></img> */}
                                                                <FcServices size={50}/>

                                                    </span>
                                                    <p className="font-bold dark:text-white text-2xl mx-2 my-4 text-yellow-600">
                                                        Setting
                                                    </p>
                                                </div>

                                                <nav className="mt-6">
                                                     <div>
                                                        <button className="w-full dark:text-white flex items-center pl-6 p-2 my-3 transition-colors duration-200 justify-start hover:bg-gradient-to-r hover:from-white to-yellow-200 hover:border-r-4 hover:border-yellow-500 hover:dark:from-gray-700 hover:dark:to-gray-800 hover:border-r-4 border-yellow-500"
                                                                type="button"
                                                                onClick={() => setShowChangeName(true)}>
                                                            <span className="text-left ">
                                                                <FcBusinessman size={30}/>
                                                            </span>
                                                            <span className="mx-4 text-md font-normal text-yellow-800 hover:font-bold">
                                                                Change Name
                                                            </span>
                                                        </button>
                                                        <button className="w-full text-gray-800 flex items-center pl-6 p-2 my-3 transition-colors duration-200 justify-start hover:bg-gradient-to-r hover:from-white to-yellow-200 hover:border-r-4 hover:border-yellow-500 hover:dark:from-gray-700 hover:dark:to-gray-800 hover:border-r-4 border-yellow-500" 
                                                                type="button"
                                                                onClick={() => setChangePass(true)}>
                                                            <span className="text-left">
                                                               <FcUnlock size={30}/>
                                                            </span>
                                                            <span className="mx-4 text-md font-normal text-yellow-800 hover:font-bold">
                                                                Change Password
                                                            </span>
                                                        </button>
                                                        <button className="w-full text-gray-800 flex items-center pl-6 p-2 my-3 transition-colors duration-200 justify-start hover:bg-gradient-to-r hover:from-white to-yellow-200 hover:border-r-4 hover:border-yellow-500 hover:dark:from-gray-700 hover:dark:to-gray-800 hover:border-r-4 border-yellow-500"
                                                                type="button"
                                                                onClick={() => setInviteUser(true)}>
                                                            <span className="text-left">
                                                            <FcPlus size={30}/>
                                                            </span>
                                                            <span className="mx-4 text-md font-normal text-yellow-800 hover:font-bold">
                                                                Invite User
                                                            </span>
                                                        </button>
                                                        <button className="w-full text-gray-800 flex items-center pl-6 p-2 my-3 transition-colors duration-200 justify-start hover:bg-gradient-to-r hover:from-white to-yellow-200 hover:border-r-4 hover:border-yellow-500 hover:dark:from-gray-700 hover:dark:to-gray-800 hover:border-r-4 border-yellow-500"
                                                                type="button"
                                                                onClick={() => setKickUser(true)}>
                                                            <span className="text-left">
                                                                <FcMinus size={30}/>
                                                            </span>
                                                            <span className="mx-4 text-md font-normal text-yellow-800 hover:font-bold">
                                                                Kick Users
                                                            </span>
                                                        </button>
                                                        <button className="w-full text-gray-800 flex items-center pl-6 p-2 my-3 transition-colors duration-200 justify-start hover:bg-gradient-to-r hover:from-white to-yellow-200 hover:border-r-4 hover:border-yellow-500 hover:dark:from-gray-700 hover:dark:to-gray-800 hover:border-r-4 border-yellow-500"
                                                                type="button"
                                                                onClick={() => setBanUser(true)}>
                                                            <span className="text-left">
                                                                <FcCancel size={30}/>
                                                            </span>
                                                            <span className="mx-4 text-md font-normal text-yellow-800 hover:font-bold">
                                                                Ban Users
                                                            </span>
                                                        </button>
                                                        <button className="w-full text-gray-800 flex items-center pl-6 p-2 my-3 transition-colors duration-200 justify-start hover:bg-gradient-to-r hover:from-white to-yellow-200 hover:border-r-4 hover:border-yellow-500 hover:dark:from-gray-700 hover:dark:to-gray-800 hover:border-r-4 border-yellow-500"
                                                                type="button"
                                                                onClick={() => setUnbanUser(true)}>
                                                            <span className="text-left">
                                                                <FcDataBackup size={30}/>
                                                            </span>
                                                            <span className="mx-4 text-md font-normal text-yellow-800 hover:font-bold">
                                                                Unban Users
                                                            </span>
                                                        </button>
                                                        <button className="w-full text-gray-800 flex items-center pl-6 p-2 my-3 transition-colors duration-200 justify-start hover:bg-gradient-to-r hover:from-white to-yellow-200 hover:border-r-4 hover:border-yellow-500 hover:dark:from-gray-700 hover:dark:to-gray-800 hover:border-r-4 border-yellow-500"
                                                                type="button"
                                                                onClick={() => setAlertLeaveRoom(true)}>
                                                            <span className="text-left">
                                                              <FcImport size={30}/>
                                                            </span>
                                                            <span className="mx-4 text-md font-normal text-yellow-800 hover:font-bold">
                                                                Leave Room
                                                            </span>
                                                        </button>
                                                    </div>
                                                </nav>
                                            </div>
                                        </div>
                                        <div className="flex flex-col w-full md:space-y-4">
                                            <header className="w-full h-16 z-40 flex items-center justify-between">
                                                <Menu as ="div" className="block lg:hidden ml-6">
            
                                                    <Menu.Button className="flex p-2 items-center rounded-full bg-white shadow text-gray-500 text-md">
                                                        <svg width="20" height="20" className="text-gray-400" fill="currentColor" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M1664 1344v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45z">
                                                            </path>
                                                        </svg>
                                                    </Menu.Button>
                                                    
                        
                                                <Menu.Items className="origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                <div className="py-1">
                                                    <Menu.Item>
                                                        <button className="w-full dark:text-white flex items-center pl-6 p-2 my-3 transition-colors duration-200 justify-start hover:bg-gradient-to-r hover:from-white to-yellow-200 hover:border-r-4 hover:border-yellow-500 hover:dark:from-gray-700 hover:dark:to-gray-800 hover:border-r-4 border-yellow-500"
                                                                type="button"
                                                                onClick={() => setShowChangeName(true)}>
                                                            <span className="text-left ">
                                                                <FcBusinessman size={30}/>
                                                            </span>
                                                            <span className="mx-4 text-md font-normal text-yellow-800 hover:font-bold">
                                                                Change Name
                                                            </span>
                                                        </button>                    
                                                    </Menu.Item>
                                                    <Menu.Item>  
                                                        <button className="w-full text-gray-800 flex items-center pl-6 p-2 my-3 transition-colors duration-200 justify-start hover:bg-gradient-to-r hover:from-white to-yellow-200 hover:border-r-4 hover:border-yellow-500 hover:dark:from-gray-700 hover:dark:to-gray-800 hover:border-r-4 border-yellow-500" 
                                                                 type="button"
                                                                 onClick={() => setChangePass(true)}>
                                                            <span className="text-left">
                                                                <FcUnlock size={30}/>
                                                            </span>
                                                            <span className="mx-4 text-md font-normal text-yellow-800 hover:font-bold">
                                                                Change Password
                                                            </span>
                                                        </button>
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        <button className="w-full text-gray-800 flex items-center pl-6 p-2 my-3 transition-colors duration-200 justify-start hover:bg-gradient-to-r hover:from-white to-yellow-200 hover:border-r-4 hover:border-yellow-500 hover:dark:from-gray-700 hover:dark:to-gray-800 hover:border-r-4 border-yellow-500"
                                                                type="button"
                                                                onClick={() => setInviteUser(true)}>
                                                            <span className="text-left">
                                                                <FcPlus size={30}/>
                                                            </span>
                                                            <span className="mx-4 text-md font-normal text-yellow-800 hover:font-bold">
                                                                Invite User
                                                            </span>
                                                        </button>               
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        <button className="w-full text-gray-800 flex items-center pl-6 p-2 my-3 transition-colors duration-200 justify-start hover:bg-gradient-to-r hover:from-white to-yellow-200 hover:border-r-4 hover:border-yellow-500 hover:dark:from-gray-700 hover:dark:to-gray-800 hover:border-r-4 border-yellow-500"
                                                                type="button"
                                                                onClick={() => setKickUser(true)}>
                                                            <span className="text-left">
                                                                <FcMinus size={30}/>
                                                            </span>
                                                            <span className="mx-4 text-md font-normal text-yellow-800 hover:font-bold">
                                                                Kick Users
                                                            </span>
                                                        </button>
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        <button className="w-full text-gray-800 flex items-center pl-6 p-2 my-3 transition-colors duration-200 justify-start hover:bg-gradient-to-r hover:from-white to-yellow-200 hover:border-r-4 hover:border-yellow-500 hover:dark:from-gray-700 hover:dark:to-gray-800 hover:border-r-4 border-yellow-500"
                                                                type="button"
                                                                onClick={() => setBanUser(true)}>
                                                            <span className="text-left">
                                                                <FcCancel size={30}/>
                                                            </span>
                                                            <span className="mx-4 text-md font-normal text-yellow-800 hover:font-bold">
                                                                Ban Users
                                                            </span>
                                                        </button>
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        <button className="w-full text-gray-800 flex items-center pl-6 p-2 my-3 transition-colors duration-200 justify-start hover:bg-gradient-to-r hover:from-white to-yellow-200 hover:border-r-4 hover:border-yellow-500 hover:dark:from-gray-700 hover:dark:to-gray-800 hover:border-r-4 border-yellow-500"
                                                                type="button"
                                                                onClick={() => setUnbanUser(true)}>
                                                            <span className="text-left">
                                                                <FcDataBackup size={30}/>
                                                            </span>
                                                            <span className="mx-4 text-md font-normal text-yellow-800 hover:font-bold">
                                                                Unban Users
                                                            </span>
                                                        </button>
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        <button className="w-full text-gray-800 flex items-center pl-6 p-2 my-3 transition-colors duration-200 justify-start hover:bg-gradient-to-r hover:from-white to-yellow-200 hover:border-r-4 hover:border-yellow-500 hover:dark:from-gray-700 hover:dark:to-gray-800 hover:border-r-4 border-yellow-500"
                                                                type="button"
                                                                onClick={() => setAlertLeaveRoom(true)}>
                                                            <span className="text-left">
                                                              <FcImport size={30}/>
                                                            </span>
                                                            <span className="mx-4 text-md font-normal text-yellow-800 hover:font-bold">
                                                                Leave Room
                                                            </span>
                                                        </button>
                                                    </Menu.Item>

                                                 
                                                </div>
                                                </Menu.Items>
                                           

                                        </Menu>
                                                

                                            </header>
                                            <div className="overflow-auto h-screen pb-24 px-4 md:px-6">
                                                <h1 className="text-4xl font-semibold text-gray-800 dark:text-white">
                                                    Welcome, {displayName}
                                                </h1>
                                                <h2 className="text-sm text-gray-400">
                                                    Here is the detail of your account
                                                </h2>
                                                <div className="flex my-6 items-center w-full space-y-4 md:space-x-4 md:space-y-0 flex-col md:flex-row">
                                                    <div className="w-full md:w-6/12">
                                                        <div className="shadow-lg w-full bg-white dark:bg-gray-700 relative overflow-hidden hover:scale-110 duration-200">
                                                            <div className="w-full h-full block">
                                                                <button className="flex items-center justify-between px-4 py-6 space-x-4 ">
                                                                    <div className="flex items-center ">
                                                                        {/* <span class="rounded-full relative p-5 bg-yellow-100">
                                                                            <svg width="40" fill="currentColor" height="40" class="text-yellow-500 h-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M1362 1185q0 153-99.5 263.5t-258.5 136.5v175q0 14-9 23t-23 9h-135q-13 0-22.5-9.5t-9.5-22.5v-175q-66-9-127.5-31t-101.5-44.5-74-48-46.5-37.5-17.5-18q-17-21-2-41l103-135q7-10 23-12 15-2 24 9l2 2q113 99 243 125 37 8 74 8 81 0 142.5-43t61.5-122q0-28-15-53t-33.5-42-58.5-37.5-66-32-80-32.5q-39-16-61.5-25t-61.5-26.5-62.5-31-56.5-35.5-53.5-42.5-43.5-49-35.5-58-21-66.5-8.5-78q0-138 98-242t255-134v-180q0-13 9.5-22.5t22.5-9.5h135q14 0 23 9t9 23v176q57 6 110.5 23t87 33.5 63.5 37.5 39 29 15 14q17 18 5 38l-81 146q-8 15-23 16-14 3-27-7-3-3-14.5-12t-39-26.5-58.5-32-74.5-26-85.5-11.5q-95 0-155 43t-60 111q0 26 8.5 48t29.5 41.5 39.5 33 56 31 60.5 27 70 27.5q53 20 81 31.5t76 35 75.5 42.5 62 50 53 63.5 31.5 76.5 13 94z">
                                                                                </path>
                                                                            </svg>
                                                                        </span> */}
                                                                        <p className="text-sm text-yellow-500 dark:text-white ml-2 font-semibold border-b border-gray-200 ">
                                                                            Room Name
                                                                        </p>
                                                                    </div>
                                                                    <div className="border-b border-gray-200 mt-6 md:mt-0 text-black dark:text-white font-bold text-md">

                                                                        <span className="text-sm text-gray-400 mx-2">
                                                                            {roomName}
                                                                        </span>
                                                                    </div>
                                                                </button>
                                                                {/* <div class="w-full h-3 bg-gray-100">
                                                                    <div class="w-2/5 h-full text-center text-xs text-white bg-green-400">
                                                                    </div>
                                                                </div> */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center w-full md:w-1/2 space-x-4">
                                                        <div className="w-1/2 ">
                                                            <button className="shadow-lg px-4 py-6 w-full bg-white dark:bg-gray-700 relative hover:scale-110 duration-300">
                                                                <p className="text-sm text-black dark:text-white font-bold ">
                                                                    {userID}
                                                                </p>
                                                                <p className="text-yellow-500 text-sm">
                                                                    User ID
                                                                </p>
                                                            </button>
                                                        </div>
                                                        <div className="w-1/2">
                                                            <div className="shadow-lg px-4 py-6 w-full bg-white dark:bg-gray-700 relative hover:scale-110 duration-300">
                                                                <p className="text-2xl text-black dark:text-white font-bold">
                                                                    4
                                                                </p>
                                                                <p className="text-yellow-500 text-sm">
                                                                    People
                                                                </p>
                                                                {/* <span class="rounded-full absolute p-4 bg-purple-500 top-2 right-4">
                                                                    <svg width="40" fill="currentColor" height="40" class="text-white h-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M1362 1185q0 153-99.5 263.5t-258.5 136.5v175q0 14-9 23t-23 9h-135q-13 0-22.5-9.5t-9.5-22.5v-175q-66-9-127.5-31t-101.5-44.5-74-48-46.5-37.5-17.5-18q-17-21-2-41l103-135q7-10 23-12 15-2 24 9l2 2q113 99 243 125 37 8 74 8 81 0 142.5-43t61.5-122q0-28-15-53t-33.5-42-58.5-37.5-66-32-80-32.5q-39-16-61.5-25t-61.5-26.5-62.5-31-56.5-35.5-53.5-42.5-43.5-49-35.5-58-21-66.5-8.5-78q0-138 98-242t255-134v-180q0-13 9.5-22.5t22.5-9.5h135q14 0 23 9t9 23v176q57 6 110.5 23t87 33.5 63.5 37.5 39 29 15 14q17 18 5 38l-81 146q-8 15-23 16-14 3-27-7-3-3-14.5-12t-39-26.5-58.5-32-74.5-26-85.5-11.5q-95 0-155 43t-60 111q0 26 8.5 48t29.5 41.5 39.5 33 56 31 60.5 27 70 27.5q53 20 81 31.5t76 35 75.5 42.5 62 50 53 63.5 31.5 76.5 13 94z">
                                                                        </path>
                                                                    </svg>
                                                                </span> */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <button className="flex items-center text-gray-400 text-md border-gray-300 border px-4 py-2 rounded-tl-sm rounded-bl-full rounded-r-full hover:text-yellow-500 hover:border-yelllow-500 hover:border hover:px-4 hover:py-2 hover:rounded-tl-sm hover:rounded-bl-full hover:rounded-r-full hover:scale-110 duration-300"
                                                            type="submit"
                                                            onClick={() => history.push('/room')}>
                                        
                                                        <FcDepartment size={20}/>
                                                        Change Room
                                                        
                                                    </button>
                                                    <span className="text-md text-gray-400">
                                                        Current Room List:
                                                    </span>
                                                </div>
                                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-10">
                                                    {listItems}
                                                </div> 
                                            </div>
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
        getRoomNameById
    } = useMatrixClient();
    const [yesLogin, setYesLogin] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [userID, setUserId] = useState(null);
    const [displayName, setDisplayName] = useState(null);
    const [roomID, setRoomID] = useState(null);
    const [roomList, setRoomList] = useState([]);
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

							setUserId(user_ID);
							setDisplayName(display_name);
							setRoomID(room_id);
							setRoomList(matrixRoom);
                            setRoomName(room_name);

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
                            setRoomName(null)
						}
					})();
				};

				get_avatar();
            }, 500);
        })();


    }, [avatar, getAvatar, isLogin,getDisplayName, getMatrixRooms, getRoomIdByName, getUserId, testLogin, getRoomNameById]);

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
