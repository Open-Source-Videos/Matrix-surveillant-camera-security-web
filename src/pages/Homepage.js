import React, { useEffect, useState } from 'react';
import '../index.css';
import useMatrixClient from '../hooks/useMatrixClient';
import { ModalPopUp } from '../components/ModalPopUp';
import TopNavigationBar from '../components/TopNavigationBar';
import Page403 from './Page403';
import {
    ClockIcon,
    CloudDownloadIcon,
    VideoCameraIcon,
    TrashIcon,
} from '@heroicons/react/outline';
import { currentRoomID, setCurrentRoomID } from './Roompage';

// Global list
let list_image_url = [];
let list_video_url = [];
let list_delete = localStorage.getItem('deleteMessage');
if (list_delete === null) {
    list_delete = [];
} else {
    list_delete = JSON.parse(list_delete);
}
// Clear state when logging out
export const clearState = () => {
    list_image_url = [];
    list_video_url = [];
};

let sentVideoRequest = localStorage.getItem('sentRequestVideos');
//console.log('\n\n\n\n test =', sentVideoRequest);
if (sentVideoRequest === null || typeof sentVideoRequest === 'undefined') {
    sentVideoRequest = { test: '' };
} else {
    console.log(sentVideoRequest);
    sentVideoRequest = JSON.parse(sentVideoRequest);
}

function Home() {
    const [listImageURL, setListImageURL] = useState(list_image_url);
    //  const [listVideoURL, setListVideoURL] = useState(list_video_url);

    const {
        isLogin,
        sendMessageToRoom,
        saveBlobUrlToFile,
        testLogin,
        setHavingNewFile,
        getHistory,
        removeOnHavingNewFile,
    } = useMatrixClient();

    const [yesLogin, setYesLogin] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [playingVideo, setPlayingVideo] = useState();

    const handleHavingNewFile = (sender, room, file, time) => {
        if (currentRoomID === room) {
            let localTime = null;
            let json_obj = null;
            let content = null;

            try {
                localTime = JSON.parse(file.fileName).content.split(',')[1];
                localTime = new Date(localTime);
            } catch (e) {
                console.log('e');
                localTime = new Date();
            }
            localTime = localTime.toLocaleString();

            switch (file.fileType) {
                case 'image/png':
                case 'image/jpeg':
                    try {
                        json_obj = JSON.parse(file.fileName);
                        content = json_obj.content.replace('.thumb', '');
                    } catch {
                        json_obj = null;
                        content = null;
                    }

                    let myContent = {
                        url: file.fileUrl,
                        id: content,
                        time: localTime,
                        type: 'image',
                    };

                    let addList = true;
                    for (let image of list_delete) {
                        if (image.id === myContent.id) {
                            addList = false;
                            break;
                        }
                    }

                    if (addList) {
                        list_image_url.push(myContent);
                        setListImageURL([...list_image_url]);
                    }
                    console.log('current_list', list_image_url);

                    if (
                        currentRoomID &&
                        typeof sentVideoRequest[time] === 'undefined' &&
                        json_obj &&
                        json_obj.type === 'thumbnail'
                    ) {
                        //send request-video message to room

                        //  setIsLoadingVideo(true);
                        json_obj.type = 'video-request';
                        json_obj.content = json_obj.content.split(',')[0];
                        const message = JSON.stringify(json_obj);

                        sendMessageToRoom(currentRoomID, message);
                        sentVideoRequest[time] = file;

                        localStorage.setItem(
                            'sentRequestVideos',
                            JSON.stringify({
                                ...sentVideoRequest,
                            })
                        );
                    }
                    break;
                case 'video/mp4':
                    let imgID = null;
                    try {
                        json_obj = JSON.parse(file.fileName);
                        imgID = json_obj.content;
                    } catch {
                        json_obj = null;
                        imgID = null;
                    }

                    let mContent = {
                        url: file.fileUrl,
                        id: imgID,
                        time: localTime,
                        type: 'video',
                    };


                    list_video_url.push(mContent);
                    updateType(imgID);

                    break;
                default:
                    break;
            }
        }
    };

    const updateType = (imgID) => {
        let found = false;

        for (let i = 0; i < list_image_url.length; i++) {
            if (imgID === list_image_url[i].id) {
                list_image_url[i].type = 'video';
                found = true;
                break;
            }
        }
        if (found) {
            setListImageURL([...list_image_url]);
        }
    };

    const handleWatch = (imgID) => {
        for (let i = 0; i < list_video_url.length; i++) {
            if (imgID === list_video_url[i].id) {
                setPlayingVideo(list_video_url[i].url);
                break;
            }
        }
        setShowModal(true);
    };

    const handleDelete = async (url, index) => {
        let deleted = false;

        for (let i = 0; i < list_image_url.length; i++) {
            if (list_image_url[i].id === url.id) {
                list_delete.push(list_image_url[i]);
                list_image_url.splice(i, 1);

                localStorage.setItem(
                    'deleteMessage',
                    JSON.stringify(list_delete)
                );

                deleted = true;
                break;
            }
        }

        if (deleted) {
            setListImageURL([...list_image_url]);
        }
    };

    const handleDownload = (url, index) => {
        if (url.type === 'image') {
            saveBlobUrlToFile(url.url, 'image'.concat(index).concat('.jpg'));
        } else {
            for (let video of list_video_url) {
                if (video.id === url.id) {
                    saveBlobUrlToFile(
                        video.url,
                        'video'.concat(index).concat('.mp4')
                    );
                    break;
                }
            }
        }
    };

    useEffect(() => {
        setHavingNewFile(handleHavingNewFile);
        (async () => {
            if (isLogin() === false) {
                setCurrentRoomID(localStorage.getItem('currentRoomID'));
                await testLogin();
                setTimeout(() => {
                    getHistory(currentRoomID);
                }, 500);
            }

            setTimeout(() => {
                setYesLogin(isLogin());
            }, 500);
        })();
        return () => {
            removeOnHavingNewFile(handleHavingNewFile);
        };
    }, []);

    return (
        <>
            {yesLogin ? (
                <div>
                    <TopNavigationBar />
                    <main>
                        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 my-5">
                            {list_image_url.length > 0 ? (
                                list_image_url.map((url, index) => {
                                    return (
                                        <div
                                            className="flex justify-center px-2"
                                            key={index}
                                            data-aos="zoom-in-down"
                                            data-aos-duration="1500"
                                        >
                                            <div className="max-w-sm bg-white rounded-lg shadow-md">
                                                <div>
                                                    <img
                                                        className="rounded-t-lg object-cover w-96 h-72"
                                                        src={url.url}
                                                        alt="thumbnails"
                                                    />
                                                </div>
                                                <div className="px-3 pb-3">
                                                    <h5 className="text-lg font-semibold text-gray-900 text-decoration-none px-2 pt-4">
                                                        Thumbnails
                                                    </h5>
                                                    <div className="flex items-center mt-2.5 mb-5">
                                                        <ClockIcon className="w-4 h-4" />
                                                        <span className="text-gray-500 text-xs font-semibold py-0.5 rounded px-2">
                                                            {url.time}
                                                        </span>
                                                    </div>
                                                    {/*<div className="flex justify-between items-center">*/}
                                                    {/*<button
                                                            onClick={
                                                                handleWatch
                                                            }
                                                            className="w-full text-gray-600 bg-gradient-to-tl from-amber-200 to-amber-300 font-medium rounded-lg text-sm px-3 py-2.5 text-center mx-2"
                                                        >
                                                            <span>
                                                                <PlayIcon className="inline-block w-5 h-5 pb-1 mr-1 -ml-1" />
                                                            </span>
                                                            Watch
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDownload(
                                                                    url
                                                                )
                                                            }
                                                            className="w-full text-white bg-gradient-to-r from-orange-400 to-rose-400 font-medium rounded-lg text-sm px-3 py-2.5 text-center mx-2"
                                                        >
                                                            <span>
                                                                <CloudDownloadIcon className="inline-block w-5 h-5 pb-1 mr-1 -ml-1" />
                                                            </span>
                                                            Download
                                                        </button>*/}
                                                    <div className="flex justify-end">
                                                        {url.type ===
                                                            'video' && (
                                                            <button
                                                                className="inline-flex items-center justify-center w-10 h-10 mr-2 p-2 text-gray-600 transition-colors duration-250 bg-amber-100 rounded-full focus:shadow-outline hover:text-white hover:bg-gradient-to-r from-orange-400 to-rose-400"
                                                                onClick={() =>
                                                                    handleWatch(
                                                                        url.id
                                                                    )
                                                                }
                                                            >
                                                                <VideoCameraIcon className="w-5 h-5" />
                                                            </button>
                                                        )}
                                                        <button
                                                            className="inline-flex items-center justify-center w-10 h-10 mr-2 p-2 text-gray-600 transition-colors duration-250 bg-amber-100 rounded-full focus:shadow-outline hover:text-white hover:bg-gradient-to-r from-orange-400 to-rose-400"
                                                            onClick={() =>
                                                                handleDownload(
                                                                    url,
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            <CloudDownloadIcon className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            className="inline-flex items-center justify-center w-10 h-10 mr-2 p-2 text-gray-600 transition-colors duration-250 bg-amber-100 rounded-full focus:shadow-outline hover:text-white hover:bg-gradient-to-r from-orange-400 to-rose-400"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    url,
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            <TrashIcon className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <></>
                            )}
                        </div>

                        <br />

                        {showModal ? (
                            <ModalPopUp
                                onClickPause={() => {
                                    setShowModal(false);
                                }}
                                videoURL={playingVideo}
                            />
                        ) : (
                            <></>
                        )}
                    </main>
                    {/*<main>
                        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 my-5">
                            {listImageURL.length > 0 ? (
                                listImageURL.map((url, index) => {
                                    return (
                                        <div
                                            className="flex justify-center px-2"
                                            key={index}
                                        >
                                            <div className="flex flex-col md:flex-row md:max-w-xl rounded-lg bg-white shadow-lg lg:items-center">
                                                <img
                                                    className="w-full h-full object-cover md:w-72 rounded-t-lg md:rounded-none md:rounded-l-lg"
                                                    src={url}
                                                    alt=""
                                                />
                                                <div className="p-6 flex flex-col justify-start">
                                                    <h5 className="text-gray-900 text-lg font-medium mb-2">
                                                        Garage View
                                                    </h5>
                                                    <p className="text-gray-700 text-base mb-4">
                                                        Tue, Apr 12 2022
                                                        21:48:12
                                                    </p>
                                                    <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
                                                        <button
                                                            type="button"
                                                            className="bg-yellow-300 hover:bg-amber-400 text-gray-800 text-sm leading-6 font-medium py-2 px-3 rounded-lg outline outline-amber-300 inline-flex items-center justify-center"
                                                            onClick={
                                                                handleWatch
                                                            }
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="w-4 h-4 mr-2"
                                                                fill="none"
                                                                viewBox="0 0 22 22"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                                />
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                                />
                                                            </svg>
                                                            <span>Watch</span>
                                                        </button>
                                                        <button className="bg-white hover:bg-amber-500 text-amber-500 text-sm leading-6 font-medium py-2 px-3 rounded-lg outline outline-amber-300 inline-flex items-center justify-center">
                                                            <svg
                                                                className="fill-current w-4 h-4 mr-2"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                                                            </svg>
                                                            <span>
                                                                Download
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <></>
                            )}
                        </div>

                        <br />

                        {showModal ? (
                            <ModalPopUp
                                onClickPause={() => {
                                    setShowModal(false);
                                }}
                            />
                        ) : (
                            <></>
                        )}
                    </main>*/}
                </div>
            ) : (
                <Page403 />
            )}
        </>
    );
}

// Check valid sign-in

/**
 * Chek if email is valid
 * @prop String email
 * @returns Boolean
 */
export const isEmail = (email) => {
    const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

export const isHomeServer = (homeserver) => {
    const re = 'https://matrix.pdxinfosec.org';
    return re.test(homeserver);
};

/**
 * Chek if vatiable is empty
 * @prop String thing
 * @returns Boolean
 */
export const isEmpty = (thing) => {
    let empty = false;

    switch (typeof thing) {
        case 'undefined':
            empty = true;
            break;
        case 'string':
            if (thing.trim().length === 0) {
                empty = true;
            }
            break;
        case 'object':
            if (thing === null) {
                empty = true;
            } else if (Object.keys(thing).length === 0) {
                empty = true;
            }
            break;
        default:
            empty = true;
    }

    return empty;
};

/**
 * Check length of the string greater than
 * @prop String|Integer str
 * @prop boolean|options.trim Trim input before validating
 * @prop number|options.lt Check if length less than lt
 * @prop number|options.lte Check if length is less than or equals to lte
 * @prop number|options.gt Check if length is greater than gt
 * @prop number|options.gte Check if length is greater than or equals to gte
 * @returns Boolean
 */
export const isLength = (str, options) => {
    if (isEmpty(options)) {
        throw new Error('Who will provide the options you?');
    }

    let isValid = true;

    if (['string', 'number'].indexOf(typeof str) === -1) {
        isValid = false;
    } else {
        // Convert to string incase it's number
        let len = 0;

        if (options.trim) {
            len = str.toString().trim().length;
        } else {
            len = str.toString().length;
        }

        if (typeof options.lt === 'number' && len >= options.lt) {
            isValid = false;
        } else if (typeof options.lte === 'number' && len > options.lte) {
            isValid = false;
        } else if (typeof options.gt === 'number' && len <= options.gt) {
            isValid = false;
        } else if (typeof options.gte === 'number' && len < options.gte) {
            isValid = false;
        }
    }

    return isValid;
};

/**
 * Check if string contains whitespaces
 * @prop String str
 * @returns Boolean
 */
export const isContainWhiteSpace = (str) => {
    if (typeof str === 'string' || typeof str === 'number') {
        return str.toString().trim().indexOf(' ') !== -1;
    } else {
        return false;
    }
};

//Check valid sign-in
export default Home;
