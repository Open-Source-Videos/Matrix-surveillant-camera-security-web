import React,{ useState } from 'react';
import axios from 'axios';

const features = ['LoginByUserName', 'LoginByDeviceId'];

const codeName = features[0];

export const initialGlobalState = {
    client: null, 
    didLogin: false ,
    roomList: [],
    update: () => {},
};

export const GlobalContext = React.createContext(initialGlobalState);


function useMatrixClient(onHavingNewMessage, onHavingNewFile, onLogInResult) {
    const global = React.useContext(GlobalContext);
    // const setClient = (c) =>{

    // }
    // let [client, setClient] = useState(() => {
    //     console.log('init client');
    //     return null;
    // });
    // let [didLogin, setDidLogin] = useState(false);

    const isLogin = () => {
        return global.didLogin;
    };

    const sendMessageToRoom = async (roomId, message) => {
        try {
            if (global.didLogin && global.client ) {
                await global.client.sendEvent(
                    roomId,
                    'm.room.message',
                    {
                        body: message,
                        msgtype: 'm.text',
                    },
                    '' //info.access_token
                );
               
            }
        } catch (e) {
            console.log('error', e);
        }
    };

    const saveBlobUrlToFile = (function () {
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

    const clientEvent = async (newClient) => {
        try {
            // newClient.on('Room.timeline', function(
            //     event,
            //     room,
            //     toStartOfTimeline
            // ) {
            //     // we know we only want to respond to messages
            //     if (event.getType() !== 'm.room.message') {
            //         return;
            //     }

            //     // we are only intested in messages from the test room, which start with "!"
            //     if (
            //         event.getRoomId() === ROOM_ID &&
            //         event.getContent().body[0] === '!'
            //     ) {
            //         console.log('');
            //         console.log('');
            //         console.log(
            //             'timeline, m.room.message = ',
            //             event.event.content.body
            //         );
            //         console.log('');
            //         console.log('');
            //     }
            // });

            // automatic accept an joining room invitation
            newClient.on(
                'RoomMember.membership',
                async (event, member) => {
                    if (
                        member.membership === 'invite' &&
                        member.userId === global.client.getUserId()
                    ) {
                        await newClient.joinRoom(member.roomId);
                        // setting up of room encryption seems to be triggered automatically
                        // but if we don't wait for it the first messages we send are unencrypted
                        await newClient.setRoomEncryption(
                            member.roomId,
                            {
                                algorithm: 'm.megolm.v1.aes-sha2',
                            }
                        );
                        console.log('');
                        console.log(
                            '>> Has join room = ',
                            member.roomId
                        );
                        console.log('');
                    }
                }
            );

            newClient.on('Event.decrypted', async (e) => {
                const { content } = e.clearEvent;

                if (content !== undefined) {
                    if (onHavingNewMessage !== null)
                        onHavingNewMessage(content.body);

                    if (typeof content.file !== 'undefined') {
                        const response = await axios.get(
                            newClient.mxcUrlToHttp(content.file.url),
                            { responseType: 'arraybuffer' }
                        );

                        const decryptData = await decryptAttachment(
                            response.data,
                            content.file
                        );

                        const blobURL = await window.URL.createObjectURL(
                            new Blob([decryptData]),
                            { type: content.info.mimetype }
                        );

                        if (onHavingNewFile)
                            onHavingNewFile({
                                fileType: content.info.mimetype,
                                fileUrl: blobURL,
                                fileName: content.body,
                            });
                    }
                }
            });

            if (newClient) {
                global.client = newClient;
                global.update({ ...global });
            }

            if (onLogInResult)
                onLogInResult(
                    true,
                    null,
                    await newClient.exportDevice(),
                    newClient.accessToken
                );
        } catch (e) {
            throw e;
        }
    };

    const loginMatrixServer = async (
        baseUrl,
        userId,
        password,
        exportedDevice,
        accessToken
    ) => {
        let newClient = null;
        await window.Olm.init();
        if (global.didLogin === false) {
            if (baseUrl && userId) {
                while (true) {
                    if (codeName === features[1]) {
                        if (exportedDevice && accessToken) {
                            console.log('use accessToken');
                            try {

                                newClient =
                                    await new window.matrixClient.createClient({
                                        baseUrl,
                                        deviceToImport: exportedDevice,
                                        accessToken,
                                        sessionStore:
                                            // await new window.matrixClient.WebStorageSessionStore(
                                            //     window.localStorage
                                            // )
                                            {
                                                getLocalTrustedBackupPubKey:
                                                    () => null,
                                            },
                                        cryptoStore:
                                            await new window.matrixClient.MemoryCryptoStore(),
                                    });
                                await newClient.initCrypto();

                                newClient.sessionStore =
                                    new window.matrixClient.WebStorageSessionStore(
                                        window.localStorage
                                    );

                                newClient.cryptoStore =
                                    new window.matrixClient.MemoryCryptoStore();
                                newClient.roomList.cryptoStore =
                                    new window.matrixClient.MemoryCryptoStore(
                                        window.localStorage
                                    );

                                newClient.accessToken = accessToken;
                                newClient.deviceId = exportedDevice.deviceId;
                            } catch (e) {
                                if (onLogInResult)
                                    onLogInResult(false, e, null, null);
                                return;
                            }
                            break;
                        }
                    }

                    if (password) {
                        try {
                            newClient = await window.matrixClient.createClient(
                                baseUrl
                            );

                            //Create stores
                            newClient.sessionStore =
                                new window.matrixClient.WebStorageSessionStore(
                                    window.localStorage
                                );
                            newClient.cryptoStore =
                                new window.matrixClient.MemoryCryptoStore();
                            newClient.roomList.cryptoStore =
                                new window.matrixClient.MemoryCryptoStore(
                                    window.localStorage
                                );

                            const info = await newClient.login(
                                'm.login.password',
                                {
                                    user: userId,
                                    password: password,
                                }
                            );
                            newClient.accessToken = info.access_token;
                            newClient.deviceId = info.device_id;
            
                            
                        } catch (e) {
                            if (onLogInResult)
                                onLogInResult(false, e, null, null);
                            return;
                        }
                    }

                    break;
                }

               
                await newClient.initCrypto();
                await newClient.setGlobalErrorOnUnknownDevices(
                    false
                );

                await newClient.startClient();

                clientEvent(newClient);
                global.didLogin = true;
                
                global.update({ ...global });

               
            }
        }
    };

    return {
        loginMatrixServer,
        saveBlobUrlToFile,
        sendMessageToRoom,
        isLogin,
    };
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

export default useMatrixClient;