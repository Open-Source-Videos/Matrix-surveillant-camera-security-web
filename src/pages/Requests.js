import React, { 
    useEffect, 
    useState, 
    Fragment 
} from 'react';
import '../index.css';
import useMatrixClient from '../hooks/useMatrixClient';
import Page403 from './Page403';
import TopNavigationBar from '../components/TopNavigationBar';
import {
    CameraIcon,
    VideoCameraIcon,
    CloudDownloadIcon,
    TrashIcon,
    ClockIcon,
    RefreshIcon,
    ExclamationIcon,
    SelectorIcon,
    ClipboardListIcon
} from '@heroicons/react/outline';
import { 
    CheckIcon,
    StarIcon
} from '@heroicons/react/solid';
import { 
    Listbox
} from '@headlessui/react';
import { Circles  } from 'svg-loaders-react';
import { ModalRequest } from "../components/ModalRequest";
import DateTimePicker from 'react-datetime-picker'


// function classNames(...classes) {
//     return classes.filter(Boolean).join(' ');
// }

// Global list
let list_snap_url = [];
let list_rec_video_url = [];
let list_recording = [];
// Clear state when logging out
export const clearAllStates = () => {
    list_snap_url = [];
    list_rec_video_url = [];
    list_recording = [];
};


const SnapShot = () => {
    const [listSnapURL, setListSnapURL] = useState(list_snap_url);
    const { saveBlobUrlToFile, setHavingNewFile, removeOnHavingNewFile } = useMatrixClient();

    const handleHavingNewFile = (sender, room, file) => {
        switch (file.fileType) {
            case 'image/png':
            case 'image/jpeg':
                if (file.fileName.includes('snapshot')) {
                    let local_time = new Date();
                    let title = null;
                    try {
                        local_time = JSON.parse(file.fileName).content.split(',')[1];
                        local_time = new Date(local_time);
                        const camera = JSON.parse(file.fileName).content.split(',')[0];
                        const list_camera = JSON.parse(localStorage.getItem('cam-config'));
                        for (var i = 0; i < list_camera.length; i++) {
                            if (list_camera[i].camera_num === parseInt(camera)) {
                                title = list_camera[i].camera
                                break;
                            }
                        }
                    } catch (e) {
                        console.log('e');
                    }
                    local_time = local_time.toLocaleString();

                    let content = {
                        url: file.fileUrl,
                        type: 'snapshot',
                        title: title,
                        time: local_time,
                        contents: JSON.parse(file.fileName),
                    };
                    list_snap_url.push(content);
                    setListSnapURL([...list_snap_url]);
                    console.log('file.fileUrl: ', file.fileUrl);
                    console.log('file.fileName: ', file.fileName);
                    console.log('file.', content);
                    console.log('file.', content.contents);
                }
                break;
            default:
                break;
        }
    };

    const handleDownloadImg = (url, index) => {
        saveBlobUrlToFile(url, 'snapshot'.concat(index).concat('.jpg'));
    };

    const handleDeleteImg = (url) => {
        list_snap_url = list_snap_url.filter((item) => {
            return item.url !== url;
        });
        setListSnapURL([...list_snap_url]);
        console.log('DELETE:', listSnapURL.includes(url));
    };

    useEffect(() => {
        setHavingNewFile(handleHavingNewFile);

        return () => {
            removeOnHavingNewFile(handleHavingNewFile);
        };
    }, [removeOnHavingNewFile, setHavingNewFile]);

    return (
        <main>
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 my-5">
                {listSnapURL.length > 0 ? (
                    listSnapURL.map((content, index) => {
                        return (
                            <div
                                className="flex justify-center px-2"
                                key={index}
                                data-aos="zoom-in-down"
                                data-aos-duration="1500"
                            >
                                <div className="max-w-sm bg-white rounded-lg shadow-md shadow-neumorphism">
                                    <div>
                                        <img
                                            className="rounded-t-lg object-cover w-96 h-72"
                                            src={content.url}
                                            alt="snapshot"
                                        />
                                    </div>
                                    <div className="px-3 pb-3">
                                        <div className="flex items-center mt-3">
                                            <StarIcon className="w-3 h-3 text-rose-500" />
                                            <span className="text-gray-600 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-sm capitalize">
                                                {content.type}
                                            </span>
                                        </div>

                                        <div className="text-lg font-semibold text-gray-900 text-decoration-none px-2 py-1">
                                            {content.title}
                                        </div>
                                        
                                        <div className="flex items-center mt-2.5 mb-4 italic">
                                            <ClockIcon className="w-3 h-3" />
                                            <span className="text-gray-500 text-xs font-semibold py-1 rounded px-2">
                                                {content.time}
                                            </span>
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                className="inline-flex items-center justify-center w-10 h-10 mr-2 p-2 text-gray-600 transition-colors duration-250 bg-amber-100 rounded-full focus:shadow-outline hover:text-white hover:bg-gradient-to-r from-orange-400 to-rose-400"
                                                onClick={() =>
                                                    handleDownloadImg(
                                                        content.url,
                                                        index
                                                    )
                                                }
                                            >
                                                <CloudDownloadIcon className="w-5 h-5" />
                                            </button>
                                            <button
                                                className="inline-flex items-center justify-center w-10 h-10 mr-2 p-2 text-gray-600 transition-colors duration-250 bg-amber-100 rounded-full focus:shadow-outline hover:text-white hover:bg-gradient-to-r from-orange-400 to-rose-400"
                                                onClick={() =>
                                                    handleDeleteImg(content.url)
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
        </main>
    );
};

const RecordVideo = () => {
    const [listRecVideoURL, setListRecVideoURL] = useState(list_rec_video_url);
    const { saveBlobUrlToFile,sendMessageToRoom, setHavingNewFile, removeOnHavingNewFile } =
        useMatrixClient();

    const handleHavingNewFile = (sender, room, file) => {
        const ROOM_ID = localStorage.getItem('currentRoomID');
        if (ROOM_ID === room) {
            let jsonObj = null;
            let content = null;

            switch (file.fileType) {
                case 'image/png':
                    case 'image/jpeg':
                        try {
                            jsonObj = JSON.parse(file.fileName);
                            content = jsonObj.content.replace('.thumb', '');
                        } catch {
                            jsonObj = null;
                            // content = null;
                        }
                        if (jsonObj && jsonObj.type === 'thumbnail') {
                            //send request-video message to room
                            jsonObj.type = 'video-request';
                            jsonObj.content = jsonObj.content.split(',')[0];
                            const message = JSON.stringify(jsonObj);
    
                            console.log(
                                'send video request ',
                                ROOM_ID,
                                message
                            );
    
                            sendMessageToRoom(ROOM_ID, message);

                        }
                        break;                
                case 'video/mp4':
                    if (file.fileName.includes('video-send')) {
                        let local_time = new Date();
                        let title = null;
                        try {
                            local_time = JSON.parse(file.fileName).content.split(',')[1];
                            local_time = new Date(local_time);
                            let content_extract = JSON.parse(file.fileName).content.split(',')[0];
                            let camera = content_extract.split('/')[4];
                            camera = camera.substring(6, camera.length);
                            const list_camera = JSON.parse(localStorage.getItem('cam-config'));
                            for (var i = 0; i < list_camera.length; i++) {
                                if (list_camera[i].camera_num === parseInt(camera)) {
                                    title = list_camera[i].camera;
                                    break;
                                }
                            }
                        } catch (e) {
                            console.log('e');
                        }
                        local_time = local_time.toLocaleString();

                        let content = {
                            url: file.fileUrl,
                            type: 'video request',
                            title: title,
                            time: local_time,
                            content: JSON.parse(file.fileName),
                        };
                        let found = false;
                        for (let i = 0; i < list_rec_video_url.length; i++) {
                            if (list_rec_video_url[i] === 'empty') {
                                list_rec_video_url[i] = content;
                                found = true;
                                break;
                            }
                        }
                        if (found === false) list_rec_video_url.push(content);

                        setListRecVideoURL([...list_rec_video_url]);
                    }
                    break;
                default:
                    break;
            }
        }
    };

    const handleDownloadVideo = (url, index) => {
        saveBlobUrlToFile(url, 'record-video('.concat(index).concat(').mp4'));
    };



    const handleDeleteRecVideo = (url) => {
        list_rec_video_url = list_rec_video_url.filter((item) => {
            return item.url !== url;
        });
        setListRecVideoURL([...list_rec_video_url]);
        console.log('DELETE:', listRecVideoURL.includes(url));
    };

    useEffect(() => {
        setHavingNewFile(handleHavingNewFile);
        return () => {
            removeOnHavingNewFile(handleHavingNewFile);
        };
    }, [handleHavingNewFile, removeOnHavingNewFile, setHavingNewFile]);

    return (
        <main>
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 my-5">
                {listRecVideoURL.length > 0 ? (
                    listRecVideoURL.map((content, index) => {
                        return (
                            <div
                                className="flex justify-center px-2"
                                key={index}
                                data-aos="zoom-in-down"
                                data-aos-duration="1500"
                            >
                                {content !== 'empty' ? (
                                    <div className="max-w-sm bg-white rounded-lg shadow-md shadow-neumorphism">
                                        <div>
                                            <video
                                                controls
                                                autoPlay
                                                className="rounded-t-lg object-cover w-96 h-72"
                                            >
                                                <source
                                                    src={content.url}
                                                    type="video/mp4"
                                                />
                                            </video>
                                        </div>
                                        <div className="px-3 pb-3">
                                            <div className="flex items-center mt-3">
                                                <StarIcon className="w-3 h-3 text-rose-500" />
                                                <span className="text-gray-600 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-sm capitalize">
                                                    {content.type}
                                                </span>
                                            </div>

                                            <div className="text-lg font-semibold text-gray-900 text-decoration-none px-2 py-1">
                                                {content.title}
                                            </div>
                                            
                                            <div className="flex items-center mt-2.5 mb-4 italic">
                                                <ClockIcon className="w-3 h-3" />
                                                <span className="text-gray-500 text-xs font-semibold py-1 rounded px-2">
                                                    {content.time}
                                                </span>
                                            </div>
                                            <div className="flex justify-end">
                                                <button
                                                    className="inline-flex items-center justify-center w-10 h-10 mr-2 p-2 text-gray-600 transition-colors duration-250 bg-amber-100 rounded-full focus:shadow-outline hover:text-white hover:bg-gradient-to-r from-orange-400 to-rose-400"
                                                    onClick={() =>
                                                        handleDownloadVideo(
                                                            content.url,
                                                            index
                                                        )
                                                    }
                                                >
                                                    <CloudDownloadIcon className="w-5 h-5" />
                                                </button>
                                                <button
                                                    className="inline-flex items-center justify-center w-10 h-10 mr-2 p-2 text-gray-600 transition-colors duration-250 bg-amber-100 rounded-full focus:shadow-outline hover:text-white hover:bg-gradient-to-r from-orange-400 to-rose-400"
                                                    onClick={() =>
                                                        handleDeleteRecVideo(
                                                            content.url
                                                        )
                                                    }
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="max-w-sm opacity-25 inset-0 z-40 bg-gray-300 rounded-lg shadow-md shadow-neumorphism animate-pulse">
                                        <div>
                                            <Circles fill="#f59e0b" strokeOpacity=".1" className="rounded-t-lg w-96 h-72 m-auto bg-gray-200 p-4"/>
                                        </div>
                                        <div className="px-3 pb-3">
                                            <div className="flex items-center px-2 pt-4 mt-1">
                                                <span className="text-gray-500 text-xs font-semibold py-0.5 rounded px-2 bg-amber-500 w-1/2 h-4"></span>
                                            </div>
                                            <div className="flex items-center mt-2.5 mb-5">
                                                <ClockIcon className="w-4 h-4 mr-2 text-rose-500" />
                                                <span className="text-gray-500 text-xs font-semibold py-0.5 rounded px-2 bg-amber-500 w-full h-3"></span>
                                            </div>
                                            <div className="flex justify-end">
                                                <button
                                                    className="inline-flex items-center justify-center w-10 h-10 mr-2 p-2 text-gray-600 transition-colors duration-250 bg-amber-300 rounded-full focus:shadow-outline hover:text-white hover:bg-gradient-to-r from-orange-400 to-rose-400"
                                                >
                                                    <CloudDownloadIcon className="w-5 h-5" />
                                                </button>
                                                <button
                                                    className="inline-flex items-center justify-center w-10 h-10 mr-2 p-2 text-gray-600 transition-colors duration-250 bg-amber-300 rounded-full focus:shadow-outline hover:text-white hover:bg-gradient-to-r from-orange-400 to-rose-400"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <></>
                )}
            </div>
        </main>
    );
};









const ListRecording = () => {
    const [listRecordingURL, setListRecordingURL] = useState(list_recording);
    const { 
        saveBlobUrlToFile,
        sendMessageToRoom, 
        setHavingNewFile, 
        // removeOnHavingNewFile, 
        setOnHavingNewMessage, 
        // removeOnHavingNewMessage 
    } = useMatrixClient();


    const handleHavingNewMessage = (sender, room, message, time) => {
        const ROOM_ID = localStorage.getItem('currentRoomID');
        if (ROOM_ID === room) {
            if (message !== null && message.includes(`"type" : "list-recording-reply"`)) {
                let list_recording_reply = JSON.parse(message);
                let list_content = list_recording_reply.content;
                list_content = list_content.replaceAll(`'`, `"`);
                let list_content_recordings = JSON.parse(list_content).recordings;
                console.log("Recording:" , list_content_recordings);
                for (let i = 0; i < list_content_recordings.length; i++) {
                    sendMessageToRoom(
                        ROOM_ID,
                        `{"type" : "video-request", "content" : "${list_content_recordings[i][0]}", "requestor_id":"0"}`
                    );
                }
            }
        }
    };

    const handleHavingNewFile = (sender, room, file) => {
        const ROOM_ID = localStorage.getItem('currentRoomID');
        if (ROOM_ID === room) {
            switch (file.fileType) {            
                case 'video/mp4':
                    if (file.fileName.includes('video-send')) {
                        let local_time = new Date();
                        let title = null;
                        try {
                            local_time = JSON.parse(file.fileName).content.split(',')[1];
                            local_time = new Date(local_time);
                            let content_extract = JSON.parse(file.fileName).content.split(',')[0];
                            let camera = content_extract.split('/')[4];
                            camera = camera.substring(6, camera.length);
                            const list_camera = JSON.parse(localStorage.getItem('cam-config'));
                            for (var i = 0; i < list_camera.length; i++) {
                                if (list_camera[i].camera_num === parseInt(camera)) {
                                    title = list_camera[i].camera;
                                    break;
                                }
                            }
                        } catch (e) {
                            console.log('e');
                        }
                        local_time = local_time.toLocaleString();

                        let content = {
                            url: file.fileUrl,
                            type: 'list recording',
                            title: title,
                            time: local_time,
                            content: JSON.parse(file.fileName),
                        };
                        let found = false;
                        for (let i = 0; i < list_rec_video_url.length; i++) {
                            if (list_rec_video_url[i] === 'empty') {
                                list_rec_video_url[i] = content;
                                found = true;
                                break;
                            }
                        }
                        if (found === false) list_rec_video_url.push(content);

                        setListRecordingURL([...list_rec_video_url]);
                    }
                    break;
                default:
                    break;
            }
        }
    };

    const handleDownloadVideo = (url, index) => {
        saveBlobUrlToFile(url, 'list-recording('.concat(index).concat(').mp4'));
    };



    const handleDeleteRecVideo = (url) => {
        list_recording = list_recording.filter((item) => {
            return item.url !== url;
        });
        setListRecordingURL([...list_recording]);
        console.log('DELETE:', listRecordingURL.includes(url));
    };

    useEffect(() => {
        setHavingNewFile(handleHavingNewFile);
        setOnHavingNewMessage(handleHavingNewMessage);
    }, [handleHavingNewMessage, setHavingNewFile, setOnHavingNewMessage]);

    return (
        <main>
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 my-5">
                {listRecordingURL.length > 0 ? (
                    listRecordingURL.map((content, index) => {
                        return (
                            <div
                                className="flex justify-center px-2"
                                key={index}
                                data-aos="zoom-in-down"
                                data-aos-duration="1500"
                            >
                                {content !== 'empty' ? (
                                    <div className="max-w-sm bg-white rounded-lg shadow-md shadow-neumorphism">
                                        <div>
                                            <video
                                                controls
                                                autoPlay
                                                className="rounded-t-lg object-cover w-96 h-72"
                                            >
                                                <source
                                                    src={content.url}
                                                    type="video/mp4"
                                                />
                                            </video>
                                        </div>
                                        <div className="px-3 pb-3">
                                            <div className="flex items-center mt-3">
                                                <StarIcon className="w-3 h-3 text-rose-500" />
                                                <span className="text-gray-600 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-sm capitalize">
                                                    {content.type}
                                                </span>
                                            </div>

                                            <div className="text-lg font-semibold text-gray-900 text-decoration-none px-2 py-1">
                                                {content.title}
                                            </div>
                                            
                                            <div className="flex items-center mt-2.5 mb-4 italic">
                                                <ClockIcon className="w-3 h-3" />
                                                <span className="text-gray-500 text-xs font-semibold py-1 rounded px-2">
                                                    {content.time}
                                                </span>
                                            </div>
                                            <div className="flex justify-end">
                                                <button
                                                    className="inline-flex items-center justify-center w-10 h-10 mr-2 p-2 text-gray-600 transition-colors duration-250 bg-amber-100 rounded-full focus:shadow-outline hover:text-white hover:bg-gradient-to-r from-orange-400 to-rose-400"
                                                    onClick={() =>
                                                        handleDownloadVideo(
                                                            content.url,
                                                            index
                                                        )
                                                    }
                                                >
                                                    <CloudDownloadIcon className="w-5 h-5" />
                                                </button>
                                                <button
                                                    className="inline-flex items-center justify-center w-10 h-10 mr-2 p-2 text-gray-600 transition-colors duration-250 bg-amber-100 rounded-full focus:shadow-outline hover:text-white hover:bg-gradient-to-r from-orange-400 to-rose-400"
                                                    onClick={() =>
                                                        handleDeleteRecVideo(
                                                            content.url
                                                        )
                                                    }
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="max-w-sm opacity-25 inset-0 z-40 bg-gray-300 rounded-lg shadow-md shadow-neumorphism animate-pulse">
                                        <div>
                                            <Circles fill="#f59e0b" strokeOpacity=".1" className="rounded-t-lg w-96 h-72 m-auto bg-gray-200 p-4"/>
                                        </div>
                                        <div className="px-3 pb-3">
                                            <div className="flex items-center px-2 pt-4 mt-1">
                                                <span className="text-gray-500 text-xs font-semibold py-0.5 rounded px-2 bg-amber-500 w-1/2 h-4"></span>
                                            </div>
                                            <div className="flex items-center mt-2.5 mb-5">
                                                <ClockIcon className="w-4 h-4 mr-2 text-rose-500" />
                                                <span className="text-gray-500 text-xs font-semibold py-0.5 rounded px-2 bg-amber-500 w-full h-3"></span>
                                            </div>
                                            <div className="flex justify-end">
                                                <button
                                                    className="inline-flex items-center justify-center w-10 h-10 mr-2 p-2 text-gray-600 transition-colors duration-250 bg-amber-300 rounded-full focus:shadow-outline hover:text-white hover:bg-gradient-to-r from-orange-400 to-rose-400"
                                                >
                                                    <CloudDownloadIcon className="w-5 h-5" />
                                                </button>
                                                <button
                                                    className="inline-flex items-center justify-center w-10 h-10 mr-2 p-2 text-gray-600 transition-colors duration-250 bg-amber-300 rounded-full focus:shadow-outline hover:text-white hover:bg-gradient-to-r from-orange-400 to-rose-400"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <></>
                )}
            </div>
        </main>
    );
};








const CamConfig = () => {
    const [newMessage, setNewMessage] = useState(null)
    const { 
        setOnHavingNewMessage, 
        removeOnHavingNewMessage 
    } = useMatrixClient();

    const handleHavingNewMessage = (sender, room, message, time) => {
        const ROOM_ID = localStorage.getItem('currentRoomID');
        if (ROOM_ID === room) {
            if (message !== null && message.includes(`"type" : "cam-config"`)) {
                let cam_config_reply = JSON.parse(message);

                let list_cam = cam_config_reply.content;
                list_cam = list_cam.substring(1, list_cam.length - 1);

                let arr_list = list_cam.split(', ');
                let list_obj = []

                for (var i in arr_list) {
                    let obj = {
                        "camera" : "Camera " + arr_list[i].replaceAll(`'`, ''),
                        "camera_num" : parseInt(arr_list[i].split(': ')[0].replaceAll(`'`, ''))
                    }
                    list_obj.push(obj)
                }
                const cam_config_list = JSON.stringify(list_obj);
                localStorage.setItem('cam-config', cam_config_list);
                setNewMessage(list_obj);
                window.location.reload()
            }
        }
    };

    const handleCamConfig = () => {
        const cam_config_list = JSON.parse(localStorage.getItem('cam-config'));
        setNewMessage(cam_config_list);
    }

    useEffect(() => {
        setOnHavingNewMessage(handleHavingNewMessage);
        handleCamConfig();
        return () => {
            removeOnHavingNewMessage(handleHavingNewMessage);
        };
    }, [removeOnHavingNewMessage, setOnHavingNewMessage]);

    return (
        <div className="grid grid-cols-1 divide-y mt-2">
            {
                newMessage !== null && (
                    newMessage.map((item, index) => (
                        <div 
                            key={index}
                            className={"text-sm my-0.5 py-2"}
                        >
                            {item.camera}
                        </div>
                    ))
                )
            }
        </div>
    )
}

const RequestGroupList = () => {
    let [child_component, setChildComponent] = useState(0);
    const [startingTimePicker, setStartingTimePicker] = useState(new Date());
    const [endingTimePicker, setEndingTimePicker] = useState(new Date());
    const [recordingSec, setRecordingSec] = useState(2);
    const [showModalSnapShot, setShowModalSnapShot] = useState(false);
    const [showModalRecVideo, setShowModalRecVideo] = useState(false);
    const [showModalCamConfig, setShowModalCamConfig] = useState(false);
    const [showModalListRecording, setShowModalListRecording] = useState(false);
    const [camConfig, setCamConfig] = useState(() => {
        const cam_config_list = JSON.parse(localStorage.getItem('cam-config'));
        if (cam_config_list === null) {
            return [
                {
                    "camera" : "Unavailable",
                    "camera_num" : -1
                }
            ];
        }
        return cam_config_list;
    });
    const [selectedCamera, setSelectedCamera] = useState(camConfig[0]);
    const { sendMessageToRoom } = useMatrixClient();

    const handleSnapshot = () => {
        setChildComponent(1);
        const ROOM_ID = localStorage.getItem('currentRoomID');
        console.log('roon', ROOM_ID);
        sendMessageToRoom(
            ROOM_ID,
            `{"type" : "snapshot", "content" : "${selectedCamera.camera_num}", "requestor_id":"0"}`
        );
        setShowModalSnapShot(false);
    };

    const handleRecordingTime = (e) => {
        setRecordingSec(e.target.value);
    }

    const handleRecVideo = () => {
        setChildComponent(2);
        const ROOM_ID = localStorage.getItem('currentRoomID');
        sendMessageToRoom(
            ROOM_ID,
            `{"type" : "record-video", "content" : "${selectedCamera.camera_num},${recordingSec}", "requestor_id":"0"}`
        );
        list_rec_video_url.push('empty');
        setShowModalRecVideo(false);
    };

    const handleListRecording = () => {
        setChildComponent(3);
        let start_time = new Date(startingTimePicker.toString().split('GMT')[0]+' UTC').toISOString();
        start_time = start_time.toString().split('.')[0];

        let end_time = new Date(endingTimePicker.toString().split('GMT')[0]+' UTC').toISOString();
        end_time = end_time.toString().split('.')[0];
        console.log("Starting Time: ", start_time);
        console.log("Ending Time: ", end_time);

        const ROOM_ID = localStorage.getItem('currentRoomID');
        sendMessageToRoom(
            ROOM_ID,
            `{"type" : "list-recordings", "content" : "${start_time}, ${end_time}", "requestor_id":"0"}`
        );

        setShowModalListRecording(false);
    };

    const handleCamConfig = () => {
        const ROOM_ID = localStorage.getItem('currentRoomID');
        console.log('roon', ROOM_ID);
        sendMessageToRoom(
            ROOM_ID,
            `{"type" : "cam-config-request", "content" : "", "requestor_id":"0"}`
        );
    };


    useEffect(() => {
        let cam_config_list = JSON.parse(localStorage.getItem('cam-config'));
        if (cam_config_list === null) {
            setCamConfig([
                {
                    "camera" : "Unavailable",
                    "camera_num" : -1
                }
            ]);
        } else {
            setCamConfig(cam_config_list);
        }
    }, [])

    return (
        <>
            <div className="md:flex md:items-center md:justify-between px-4">
                <div className="flex-1 min-w-0"></div>
                <div className="mt-3 grid md:flex md:mt-0 md:ml-2 justify-center text-center">
                    <span className="sm:block">
                        <button
                            type="button"
                            onClick={() => setShowModalSnapShot(true)}
                            className="w-full justify-center inline-flex items-center px-3 py-2 border border-orange-300 rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-400 to-rose-400 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                        >
                            <CameraIcon
                                className="-ml-1 mr-2 h-5 w-5 text-white"
                                aria-hidden="true"
                            />
                            Snapshot
                        </button>
                    </span>

                    <span className="sm:block md:ml-2">
                        <button
                            type="button"
                            onClick={() => setShowModalRecVideo(true)}
                            className="w-full justify-center inline-flex items-center px-3 py-2 border border-orange-300 rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-400 to-rose-400 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                        >
                            <VideoCameraIcon
                                className="-ml-1 mr-2 h-5 w-5 text-white"
                                aria-hidden="true"
                            />
                            Record Video
                        </button>
                    </span>

                    <span className="sm:block md:ml-2">
                        <button
                            type="button"
                            onClick={() => setShowModalCamConfig(true)}
                            className="w-full justify-center inline-flex items-center px-3 py-2 border border-orange-300 rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-400 to-rose-400 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                        >
                            <RefreshIcon
                                className="-ml-1 mr-2 h-5 w-5 text-white"
                                aria-hidden="true"
                            />
                            Camera Config
                        </button>
                    </span>

                    <span className="sm:block md:ml-2">
                        <button
                            type="button"
                            onClick={() => setShowModalListRecording(true)}
                            className="w-full justify-center inline-flex items-center px-3 py-2 border border-orange-300 rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-400 to-rose-400 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                        >
                            <ClipboardListIcon
                                className="-ml-1 mr-2 h-5 w-5 text-white"
                                aria-hidden="true"
                            />
                            List Recording
                        </button>
                    </span>
                </div>
            </div>
            <br />
            <>
                {(() => {
                    if (child_component === 1) {
                        return <SnapShot />;
                    } else if (child_component === 2) {
                        return <RecordVideo />;
                    } else if (child_component === 3) {
                        return <ListRecording />;
                    }
                })()}

                {showModalCamConfig ? (
                    <ModalRequest
                        isOpen={showModalCamConfig}
                        onClickClose={() => {
                            setShowModalCamConfig(false);
                        }}
                        dialogTitle={"Camera Configuration"}
                        dialogBody={
                            <CamConfig />
                        }
                        requestAction={handleCamConfig}
                    />
                ) : (
                    <></>
                )}

                {showModalListRecording ? (
                    <ModalRequest
                        isOpen={showModalListRecording}
                        onClickClose={() => {
                            setShowModalListRecording(false);
                        }}
                        dialogTitle={"List of recorded videos"}
                        dialogBody={
                            <>
                                <div className="grid grid-cols-1 items-center mt-3">
                                    <label className="block my-1">
                                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
                                            Starting Time
                                        </span>
                                        <DateTimePicker 
                                            onChange={setStartingTimePicker} 
                                            value={startingTimePicker} 
                                            className={"text-gray-900 text-xs sm:text-sm rounded-lg h-9 w-full my-2"}
                                            format="y-MM-dd hh:mm:ss a"
                                            autoFocus={false}
                                            maxDate={new Date()}
                                        />
                                    </label>

                                    <label className="block my-1">
                                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
                                            Ending Time
                                        </span>
                                        <DateTimePicker 
                                            onChange={setEndingTimePicker} 
                                            value={endingTimePicker} 
                                            className={"text-gray-900 text-xs sm:text-sm rounded-lg h-9 w-full my-2"}
                                            format="y-MM-dd hh:mm:ss a"
                                            autoFocus={false}
                                            maxDate={new Date()}
                                        />
                                    </label>
                                </div>
                            </>
                        }
                        requestAction={handleListRecording}
                    />
                ) : (
                    <></>
                )}

                {showModalSnapShot ? (
                    <ModalRequest
                        isOpen={showModalSnapShot}
                        onClickClose={() => {
                            setShowModalSnapShot(false);
                        }}
                        dialogTitle={"Snapshot Request"}
                        dialogBody={
                            <>
                                { camConfig[0].camera_num !== -1 ? (
                                    <Listbox 
                                        value={selectedCamera} 
                                        onChange={setSelectedCamera}
                                        as="div"
                                        className="relative space-y-1"
                                    >
                                        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none border-gray-400 focus-visible:border-rose-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-rose-300 sm:text-sm">
                                            <span className="block truncate text-black">
                                                {selectedCamera.camera}
                                            </span>
                                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
                                                <SelectorIcon
                                                    className="h-5 w-5 text-black"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                        </Listbox.Button>

                                        <Listbox.Options className={"p-0 border-1 border-gray-200 rounded-lg mt-3 divide-y"}>
                                            {camConfig.map((cam, index) => (
                                                <Listbox.Option 
                                                    key={index} 
                                                    value={cam} 
                                                    as={Fragment}
                                                    className={({ active }) =>
                                                        `relative cursor-default select-none p-2.5 rounded-lg hover:bg-gradient-to-r from-orange-400 to-rose-400 text-sm shadow-md ${
                                                            active ? 'bg-gradient-to-r from-orange-400 to-rose-400 text-white' : 'text-gray-900'
                                                        }`
                                                    }
                                                >
                                                    {({ selectedCamera }) => (
                                                        <li>
                                                            {selectedCamera && <CheckIcon className="w-4 h-4 bg-rose-500"/>}
                                                            {cam.camera}
                                                        </li>
                                                    )}
                                                </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                    </Listbox>
                                ) :
                                (
                                    <button 
                                        onClick={() => {
                                            setShowModalSnapShot(false)
                                            setShowModalCamConfig(true)
                                        }}
                                        className="group block max-w-xs mx-auto rounded-lg p-6 bg-neutral-50 ring-1 ring-amber-900/5 shadow-md space-y-3 hover:bg-amber-300 hover:ring-amber-400"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <ExclamationIcon className="h-6 w-6 stroke-amber-500 group-hover:stroke-black"></ExclamationIcon>
                                            <h3 className="text-slate-900 text-sm font-semibold">Warning</h3>
                                        </div>
                                        <p className="text-black text-sm">Your camera is currently not setting up. Please click here to request your camera.</p>
                                    </button>
                                )
                                }
                            </>
                        }
                        requestAction={handleSnapshot}
                    />
                ) : (
                    <></>
                )}

                {showModalRecVideo ? (
                    <ModalRequest
                        isOpen={showModalRecVideo}
                        onClickClose={() => {
                            setShowModalRecVideo(false);
                        }}
                        dialogTitle={"Recording Video Request"}
                        dialogBody={
                            <div className={"mt-3"}>
                                { camConfig[0].camera_num !== -1 ? (
                                    <Listbox 
                                        value={selectedCamera} 
                                        onChange={setSelectedCamera}
                                        as="div"
                                        className="relative space-y-1"
                                    >
                                        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none border-gray-400 focus-visible:border-rose-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-rose-300 sm:text-sm">
                                            <span className="block truncate text-black">
                                                {selectedCamera.camera}
                                            </span>
                                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
                                                <SelectorIcon
                                                    className="h-5 w-5 text-black"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                        </Listbox.Button>

                                        <Listbox.Options className={"p-0 border-1 border-gray-200 rounded-lg mt-3 divide-y"}>
                                            {camConfig.map((cam, index) => (
                                                <Listbox.Option 
                                                    key={index} 
                                                    value={cam} 
                                                    as={Fragment}
                                                    className={({ active }) =>
                                                        `relative cursor-default select-none p-2.5 rounded-lg hover:bg-gradient-to-r from-orange-400 to-rose-400 text-sm shadow-md ${
                                                            active ? 'bg-gradient-to-r from-orange-400 to-rose-400 text-white' : 'text-gray-900'
                                                        }`
                                                    }
                                                >
                                                    {({ selectedCamera }) => (
                                                        <li>
                                                            {selectedCamera && <CheckIcon className="w-4 h-4 bg-rose-500"/>}
                                                            {cam.camera}
                                                        </li>
                                                    )}
                                                </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                    </Listbox>
                                ) :
                                (
                                    <button 
                                        onClick={() => {
                                            setShowModalRecVideo(false)
                                            setShowModalCamConfig(true)
                                        }}
                                        className="group block max-w-xs mx-auto rounded-lg p-6 bg-neutral-50 ring-1 ring-amber-900/5 shadow-md space-y-3 hover:bg-amber-300 hover:ring-amber-400"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <ExclamationIcon className="h-6 w-6 stroke-amber-500 group-hover:stroke-black"></ExclamationIcon>
                                            <h3 className="text-slate-900 text-sm font-semibold">Warning</h3>
                                        </div>
                                        <p className="text-black text-sm">Your camera is currently not setting up. Please click here to request your camera.</p>
                                    </button>
                                )
                                }

                                <label className="block my-3">
                                    <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
                                        Input number of recording second(s)
                                    </span>
                                    <input 
                                        type="number" 
                                        value={recordingSec}
                                        onChange={handleRecordingTime}
                                        name="num_second" 
                                        className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-orange-500 block w-full rounded-md sm:text-sm focus:ring-1" 
                                        placeholder="Input number of recording seconds (0-60)" 
                                    />
                                </label>
                            </div>
                        }
                        requestAction={handleRecVideo}
                    />
                ) : (
                    <></>
                )}
            </>
        </>
    );
};

const Requests = () => {
    const { isLogin, testLogin } = useMatrixClient();

    const [yesLogin, setYesLogin] = useState(false);

    useEffect(() => {
        (async () => {
            if (isLogin() === false) {
                await testLogin();
            }

            setTimeout(() => {
                setYesLogin(isLogin());
            }, 500);
        })();
    }, [isLogin, testLogin]);

    return (
        <>
            {yesLogin ? (
                <div className={'pb-3'}>
                    <TopNavigationBar />
                    <RequestGroupList />
                </div>
            ) : (
                <Page403 />
            )}
        </>
    );
};

export default Requests;
