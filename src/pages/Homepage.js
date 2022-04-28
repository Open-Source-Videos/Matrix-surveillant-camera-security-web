import React, { 
    useEffect,
    useState 
} from 'react';
import { Redirect } from 'react-router-dom';
import '../index.css';
import { Navbar } from '../components/Navbar';
import useMatrixClient from '../hooks/useMatrixClient';
import { ModalPopUp } from "../components/ModalPopUp";

// const axios = require('axios');

// const BASE_URL = 'https://matrix.pdxinfosec.org';
// const PASSWORD = "G3Vsnzvr";
// const USERNAME = "@test003:pdxinfosec.org";
const ROOM_ID = '!bdQMmkTBTMqUPAOvms:pdxinfosec.org';

const list_image_url = [];
const list_video_url = [];

function Home() {
    const [listImageURL, setListImageURL] = useState(list_image_url);
    const [listVideoURL, setListVideoURL] = useState(list_video_url);

    const [showModal, setShowModal] = useState(false);

    const handleHavingNewFile = (file) => {
        
        switch (file.fileType) {
            case 'image/png':
            case 'image/jpeg':
                // listImageURL.push(file.fileUrl);
                // setListImageURL([...listImageURL]);
                list_image_url.push(file.fileUrl);
                setListImageURL([...list_image_url]);
                break;
            case 'video/mp4':
                list_video_url.push(file.fileUrl);
                setListVideoURL([...list_video_url]);
                // setListVideoURL(file.fileUrl);
                break;
            default:
                saveBlobUrlToFile(file.fileUrl, file.fileName);
                break;
        }

    };

    const { sendMessageToRoom, saveBlobUrlToFile, isLogin, setHavingNewFile } = useMatrixClient();

    const handleWatch = () => {
        console.log("SEND MESSAGE")
        sendMessageToRoom(
            ROOM_ID, 
            `{"type" : "video-send", "content" : "/var/lib/motioneye/Camrea1/02-05-2021/15-25-30.mp4", "requestor_id":"0"}`
        );
        setShowModal(true);
    }

    useEffect(() => {
        setHavingNewFile(handleHavingNewFile);
    }, []);

    return (
        <>
            {isLogin() ? (
                <div>
                    <Navbar />
                    <header className="App-header">
                        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
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
                                                            onClick={handleWatch}
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
                            <ModalPopUp onClickPause={() => {setShowModal(false);}}/>
                        ) : <></>}

                        <br />

                        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
                            {listVideoURL.length > 0 ? (
                                listVideoURL.map((videoURL, index) => {
                                    return (
                                        <div
                                            className="flex justify-center px-2"
                                            key={1}
                                        >
                                            <video
                                                key={index}
                                                width="500"
                                                height="500"
                                                controls
                                                autoplay
                                            >
                                                <source
                                                    src={videoURL}
                                                    type="video/mp4"
                                                />
                                            </video>
                                        </div>
                                    );
                                })
                            ) : (
                                <></>
                            )}
                        </div>
                        <br />
                    </header>
                </div>
            ) : (
                <Redirect to="/403" />
            )}
        </>
    );
}

function decryptAttachment(data, info) {
    if (
        info === undefined ||
        info.key === undefined ||
        info.iv === undefined ||
        info.hashes === undefined ||
        info.hashes.sha256 === undefined
    ) {
        throw new Error('error');
    }

    return window.crypto.subtle
        .importKey('jwk', info.key, { name: 'AES-CTR' }, false, [
            'encrypt',
            'decrypt',
        ])
        .then((key) => {
            return window.crypto.subtle
                .decrypt(
                    {
                        name: 'AES-CTR',
                        counter: decodeBase64(info.iv), //The same counter you used to encrypt
                        length: 64, //The same length you used to encrypt
                    },
                    key, //from generateKey or importKey above
                    data //ArrayBuffer of the data
                )
                .then(function (decrypted) {
                    return decrypted;
                })
                .catch(function (err) {
                    console.error(err);
                });
        });
}

function decodeBase64(base64) {
    // Pad the base64 up to the next multiple of 4.
    var paddedBase64 = base64 + '==='.slice(0, (4 - (base64.length % 4)) % 4);
    // Decode the base64 as a misinterpreted Latin-1 string.
    // window.atob returns a unicode string with codeines in the range 0-255.
    var latin1String = window.atob(paddedBase64);
    // Encode the string as a Uint8Array as Latin-1.
    var uint8Array = new Uint8Array(latin1String.length);
    for (var i = 0; i < latin1String.length; i++) {
        uint8Array[i] = latin1String.charCodeAt(i);
    }
    return uint8Array;
}

const saveByteArray = (function () {
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    return function (url, name) {
        a.href = url;
        a.download = name;
        a.click();
        window.URL.revokeObjectURL(url);
    };
})();

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
