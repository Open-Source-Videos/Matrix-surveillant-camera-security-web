import React, { 
    useEffect, 
    useState,
	Fragment
} from 'react';
import '../index.css';
import useMatrixClient from '../hooks/useMatrixClient';
import Page403 from './Page403';
import TopNavigationBar from '../components/TopNavigationBar'
import {
	ChevronDownIcon,
	CameraIcon,
	CloudIcon,
	VideoCameraIcon,
	CloudDownloadIcon,
	TrashIcon
} from '@heroicons/react/solid'
import { 
	Menu, 
	Transition 
} from '@headlessui/react';
//import { currentRoom } from './Roompage';

const ROOM_ID = '!bdQMmkTBTMqUPAOvms:pdxinfosec.org';



function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

// Global list
let list_snap_url = [];
let list_rec_video_url = [];

// Clear state when logging out
export const clearAllStates = () => {
    list_snap_url = [];
    list_rec_video_url = [];
};

const SnapShot = () => {
    const [listSnapURL, setListSnapURL] = useState(list_snap_url);
    const { saveBlobUrlToFile, setHavingNewFile } = useMatrixClient();

    const handleHavingNewFile = (sender, room, file) => {
        switch (file.fileType) {
            case 'image/png':
            case 'image/jpeg':
                if (file.fileName.includes('snapshot')) {
                    let local_time = new Date();
                    try {
                        local_time = JSON.parse(file.fileName).content.split(
                            ','
                        )[1];
                        local_time = new Date(local_time);
                    } catch (e) {
                        console.log('e');
                    }
                    local_time = local_time.toLocaleString();

                    let content = {
                        url: file.fileUrl,
                        type: 'snapshot',
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
    }, []);

    return (
        <main>
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 my-5">
                {listSnapURL.length > 0 ? (
                    listSnapURL.map((content, index) => {
                        return (
                            <div
                                className="flex justify-center px-2"
                                key={index}
                            >
                                <div className="max-w-sm bg-white rounded-lg shadow-md">
                                    <div>
                                        <img
                                            className="rounded-t-lg"
                                            src={content.url}
                                            alt="snapshot"
                                        />
                                    </div>
                                    <div className="px-3 pb-3">
                                        <h5 className="text-lg font-semibold text-gray-900 text-decoration-none px-2 pt-4">
                                            Snapshot
                                        </h5>
                                        <div className="flex items-center mt-2.5 mb-5">
                                            <span className="text-gray-700 text-xs font-semibold py-0.5 rounded px-2">
                                                {content.time}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <button
                                                onClick={() =>
                                                    handleDownloadImg(
                                                        content.url,
                                                        index
                                                    )
                                                }
                                                className="w-full text-gray-600 bg-gradient-to-tl from-amber-200 to-amber-300 font-medium rounded-lg text-sm px-3 py-2.5 text-center mx-2"
                                            >
                                                <span>
                                                    <CloudDownloadIcon className="inline-block w-5 h-5 pb-1 mr-1 -ml-1" />
                                                </span>
                                                Download
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDeleteImg(content.url)
                                                }
                                                className="w-full text-white bg-gradient-to-r from-orange-400 to-rose-400 font-medium rounded-lg text-sm px-3 py-2.5 text-center mx-2"
                                            >
                                                <span>
                                                    <TrashIcon className="inline-block w-5 h-5 pb-1 mr-1 -ml-1" />
                                                </span>
                                                Delete
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
    const { saveBlobUrlToFile, setHavingNewFile } = useMatrixClient();

    const handleHavingNewFile = (sender, room, file) => {
        switch (file.fileType) {
            case 'video/mp4':
				if (file.fileName.includes("video-send")) {
					let local_time = new Date();
					try {
						local_time = JSON.parse(file.fileName).content.split(',')[1];
						local_time = new Date(local_time);
					} catch(e) {
						console.log("e");
					}
					local_time = local_time.toLocaleString();

                    let content = {
                        url: file.fileUrl,
                        type: 'video',
                        time: local_time,
                        content: JSON.parse(file.fileName),
                    };
                    list_rec_video_url.push(content);
                    setListRecVideoURL([...list_rec_video_url]);
                    console.log('file.', file);
                    console.log('CONTENT: ', content);
                }
                break;
            default:
                break;
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
        console.log('LIST VIDEO: ', listRecVideoURL);
    }, [listRecVideoURL]);

    return (
        <main>
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 my-5">
                {listRecVideoURL.length > 0 ? (
                    listRecVideoURL.map((content, index) => {
                        return (
                            <div
                                className="flex justify-center px-2"
                                key={index}
                            >
                                <div className="max-w-sm bg-white rounded-lg shadow-md">
                                    <div>
                                        <video
                                            controls
                                            autoPlay
                                            className="rounded-t-lg"
                                        >
                                            <source
                                                src={content.url}
                                                type="video/mp4"
                                            />
                                        </video>
                                    </div>
                                    <div className="px-3 pb-3">
                                        <h5 className="text-lg font-semibold text-gray-900 text-decoration-none px-2 pt-4">
                                            Recoding Video
                                        </h5>
                                        <div className="flex items-center mt-2.5 mb-5">
                                            <span className="text-gray-700 text-xs font-semibold py-0.5 rounded px-2">
                                                {content.time}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <button
                                                onClick={() =>
                                                    handleDownloadVideo(
                                                        content.url,
                                                        index
                                                    )
                                                }
                                                className="w-full text-gray-600 bg-gradient-to-tl from-amber-200 to-amber-300 font-medium rounded-lg text-sm px-3 py-2.5 text-center mx-2"
                                            >
                                                <span>
                                                    <CloudDownloadIcon className="inline-block w-5 h-5 pb-1 mr-1 -ml-1" />
                                                </span>
                                                Download
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDeleteRecVideo(
                                                        content.url
                                                    )
                                                }
                                                className="w-full text-white bg-gradient-to-r from-orange-400 to-rose-400 font-medium rounded-lg text-sm px-3 py-2.5 text-center mx-2"
                                            >
                                                <span>
                                                    <TrashIcon className="inline-block w-5 h-5 pb-1 mr-1 -ml-1" />
                                                </span>
                                                Delete
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

const RequestGroupList = () => {
	let [child_component, setChildComponent] = useState(0);
	const { 
		sendMessageToRoom,
	} = useMatrixClient();

    const handleSnapshot = () => {
        setChildComponent(1);
        sendMessageToRoom(
            ROOM_ID,
            `{"type" : "snapshot", "content" : "1", "requestor_id":"0"}`
        );
    };

    const handleRecVideo = () => {
        setChildComponent(2);
        sendMessageToRoom(
            ROOM_ID,
            `{"type" : "record-video", "content" : "1,20", "requestor_id":"0"}`
        );
    };

    return (
        <>
            <div className="lg:flex lg:items-center lg:justify-between px-4">
                <div className="flex-1 min-w-0"></div>
                <div className="mt-3 flex lg:mt-0 lg:ml-2">
                    <span className="hidden sm:block">
                        <button
                            type="button"
                            onClick={handleSnapshot}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <CameraIcon
                                className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                                aria-hidden="true"
                            />
                            Snapshot
                        </button>
                    </span>

                    <span className="hidden sm:block ml-2">
                        <button
                            type="button"
                            onClick={handleRecVideo}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <VideoCameraIcon
                                className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                                aria-hidden="true"
                            />
                            Record Video
                        </button>
                    </span>

                    <span className="sm:ml-2">
                        <button
                            type="button"
                            className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <CloudIcon
                                className="-ml-1 mr-2 h-5 w-5"
                                aria-hidden="true"
                            />
                            Recordings
                        </button>
                    </span>

					{/* Dropdown */}
					<Menu as="span" className="ml-3 relative sm:hidden">
						<Menu.Button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
							More
							<ChevronDownIcon className="-mr-1 ml-2 h-5 w-5 text-gray-500" aria-hidden="true" />
						</Menu.Button>
				
						<Transition
							as={Fragment}
							enter="transition ease-out duration-200"
							enterFrom="transform opacity-0 scale-95"
							enterTo="transform opacity-100 scale-100"
							leave="transition ease-in duration-75"
							leaveFrom="transform opacity-100 scale-100"
							leaveTo="transform opacity-0 scale-95"
						>
							<Menu.Items className="origin-top-right absolute right-0 mt-2 -mr-1 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
								<Menu.Item>
									{({ active }) => (
									<button
										type="button"
										onClick={handleSnapshot}
										className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
									>
										Snapshot
									</button>
									)}
								</Menu.Item>
								<Menu.Item>
									{({ active }) => (
									<button
										type="button"
										onClick={handleRecVideo}
										className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
									>
										Recording Video
									</button>
									)}
								</Menu.Item>
							</Menu.Items>
						</Transition>
					</Menu>
				</div>
			</div>
            <br />
            {/*<SnapShot />
			<div>Recording video</div>
			<RecordVideo />*/}
            <>
                {(() => {
                    if (child_component === 1) {
                        return <SnapShot />;
                    } else if (child_component === 2) {
                        return <RecordVideo />;
                    }
                })()}
            </>
        </>
    );
};

const Requests = () => {
    const {
        isLogin,
        testLogin,
    } = useMatrixClient();

    const [yesLogin, setYesLogin] = useState(false);

    useEffect(() => {
        (async () => {

            if (isLogin() === false) {
                await testLogin()
            }
			
			setTimeout(() => {
				setYesLogin(isLogin());
			}, 500);
        })();
    }, []);

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
