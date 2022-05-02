import React, { useState } from 'react';
import axios from 'axios';
import { tab } from '@testing-library/user-event/dist/tab';

const features = ['LoginByUserName', 'LoginByDeviceId'];
const codeName = features[0];

const ROOM_CRYPTO_CONFIG = { algorithm: 'm.megolm.v1.aes-sha2' };
var client = null;
var didLogin = false;
var roomList = [];
var avatar = null;

var onHavingNewMessage = null;
var onHavingNewFile = null;
var onLogInResult = null;

function useMatrixClient() {
    // let [client, setClient] = useState(() => {
    //     console.log('init client');
    //     return null;
    // });
    // let [didLogin, setDidLogin] = useState(false);

    // let [roomList, setRoomList] = useState([]);

    const setOnLogInResult = (_onLogInResult) => {
        console.log('\n\n Log \n\n', _onLogInResult);
        onLogInResult = _onLogInResult;
    };

    const setHavingNewFile = (_onHavingNewFile) => {
        onHavingNewFile = _onHavingNewFile;
    };

    const setOnHavingNewMessage = (_onHavingNewMessage) => {
        onHavingNewMessage = _onHavingNewMessage;
    };

    const isLogin = () => {
        return didLogin;
    };

    const logoutMatrixServer = () => {
        try {
            if (client !== null) {
                client.removeAllListeners();
                client.stopClient();

                client = null;
            }
        } catch (e) {
            client = null;
        }
    };

    const getMatrixRooms = () => {
        // console.log('+++++++++++++++++++');
        // console.log('haha', roomList);
        // for (let i = 0; i < roomList.length; i++) {
        //     for (let j = 0; j < roomList[i].timeline.length; j++) {
        //         console.log(roomList[i].timeline[j].event.type);
        //     }
        // }
        // console.log('+++++++++++++++++++');

        return roomList;
    };

    const createMatrixRoom = async (roomID, usersToInvite) => {
        if (roomID !== null) {
            const { room_id: roomID } = await client.createRoom({
                visibility: 'private',
                invite: usersToInvite,
            });

            // await client.sendStateEvent(
            //     roomID,
            //     'm.room.encryption',
            //     ROOM_CRYPTO_CONFIG
            // );
            // await client.setRoomEncryption(roomID, ROOM_CRYPTO_CONFIG);

            // // Marking all devices as verified
            // let room = client.getRoom(roomID);

            // let members = (await room.getEncryptionTargetMembers()).map(
            //     (x) => x['userId']
            // );

            // let memberkeys = await client.downloadKeys(members);

            // for (const userId in memberkeys) {

            //     for (const deviceId in memberkeys[userId]) {
            //         await this.setDeviceVerified(userId, deviceId);
            //     }
            // }
        }
        return roomID;
    };
    
    const getAvatar = async (userId) => {

        try {
            if (didLogin && client) {
                var profile = await client.getProfileInfo(userId, 'avatar_url');
                avatar = client.mxcUrlToHttp(profile.avatar_url)
                console.log("Avatar:::", avatar)
            }
        } catch (e) {
            console.log('error', e);
        }
        return avatar;
    }

    const sendMessageToRoom = async (roomId, message) => {
        try {
            if (didLogin && client) {
                await client.sendEvent(
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

    const getHistory = async (roomID, limit = 30) => {
        try {
            if (didLogin && client) {
                for (let i = 0; i < roomList.length; i++) {
                    console.log('roomList[i].roomId', roomList[i]);

                    if (roomList[i].roomId === roomID) {
                        var messageEvent = await client.scrollback(
                            roomList[i],
                            limit
                        );
                        if (messageEvent !== null) {
                            return messageEvent.timeline
                                .filter(
                                    (e) =>
                                        e.clearEvent !== null &&
                                        e.clearEvent.content !== null
                                )
                                .map((e) => e.clearEvent);
                        }
                    }

                    //for (let j = 0; j < rooms[i].timeline.length; j++) {
                    //    console.log(rooms[i].timeline[j].getContent());
                    //}
                }
            }
        } catch (e) {
            console.log('error', e);
        }
    };

    const reloginMatrixServer = async (
        baseUrl,
        exportedDevice,
        accessToken
    ) => {
        console.log('\n\n\n\nlogging by access token\n\n\n\n')
        let newClient = null;
        //await window.Olm.init();    
        console.log('use accessToken');


        try {
            newClient = await new window.matrixClient.createClient({
                baseUrl,
                deviceToImport: exportedDevice,
                accessToken,
                sessionStore:
                    await new window.matrixClient.WebStorageSessionStore(
                        window.localStorage
                    ),
                cryptoStore: await new window.matrixClient.MemoryCryptoStore(),
            });
            
            newClient.sessionStore =
                new window.matrixClient.WebStorageSessionStore(
                    window.localStorage
                );

            newClient.cryptoStore = new window.matrixClient.MemoryCryptoStore();

            newClient.roomList.cryptoStore =
                new window.matrixClient.MemoryCryptoStore();

            newClient.accessToken = accessToken;
            newClient.deviceId = exportedDevice.deviceId;

            await newClient.initCrypto();

            newClient.roomList.cryptoStore =
            new window.matrixClient.MemoryCryptoStore();

            await newClient.startClient();


            

            // await newClient.stopClient();
            
            // await newClient.initCrypto();
            // await newClient.setGlobalErrorOnUnknownDevices(false);
            // await newClient.startClient();

            matrixClientEvents(newClient); 
            //await newClient.startClient();

        } catch (e) {
            if (onLogInResult) onLogInResult(false, e, null, null);
            return;
        }
    };

    const loginMatrixServer = async (baseUrl, userId, password) => {
        console.log('Logging by password')
        let newClient = null;
        await window.Olm.init();

        try {
            newClient = await window.matrixClient.createClient(baseUrl);

            //Create stores
            newClient.sessionStore =
                new window.matrixClient.WebStorageSessionStore(
                    window.localStorage
                );
            newClient.cryptoStore = new window.matrixClient.MemoryCryptoStore();

            const info = await newClient.login('m.login.password', {
                user: userId,
                password: password,
            });


            newClient.roomList.cryptoStore =
            new window.matrixClient.MemoryCryptoStore();

            newClient.accessToken = info.access_token;
            newClient.deviceId = info.device_id;
            console.log("INFO22", info);

            await newClient.initCrypto();
            await newClient.setGlobalErrorOnUnknownDevices(false);
            await newClient.startClient();


            // await newClient.stopClient();
            
            // await newClient.initCrypto();
            // await newClient.setGlobalErrorOnUnknownDevices(false);
            // await newClient.startClient();

            matrixClientEvents(newClient);
        } catch (e) {
            if (onLogInResult) onLogInResult(false, e, null, null);
            return;
        }
    };

    const matrixClientEvents = (newClient) => {
        
        newClient.once('sync', async function (state, prevState, res) {
            if (state === 'PREPARED') {
                // state will be 'PREPARED' when the client is ready to use

                didLogin = true;
                roomList = await newClient.getRooms();
                client = newClient;

                var profile = await newClient.getProfileInfo("@test010:pdxinfosec.org")
                console.log("PROFILE222", profile)

                if (onLogInResult !== null)
                    onLogInResult(
                        true,
                        null,
                        await client.exportDevice(),
                        client.accessToken
                    );
                    console.log('Having a new  history')

                    for (let i = 0; i < roomList.length; i++)
                    console.log(roomList[i]);

                    for (let i = 0; i < roomList.length; i++)
                    await client.scrollback(roomList[i], 10);

                    // setTimeout(()=>{
                    //     for (let i = 0; i < roomList.length; i++)
                    //     console.log(roomList[i].getHistoryVisibility());

                    // },1000)



            }
        });

        newClient.on('Room',async  function (room) {
            roomList.push(room);
           
        });

        newClient.on(
            'Room.timeline',
            function (event, room, toStartOfTimeline) {
                if (event.getType() === "m.room.create") {

                }
                // we know we only want to respond to messages
                // if (event.getType() !== 'm.room.message') {
                //     return;
                // }

                // we are only intested in messages from the test room, which start with "!"
                // if (
                //     event.getRoomId() === roomID &&
                //     event.getContent().body[0] === '!'
                // ) {
                //     console.log('');
                //     console.log('');
                //     console.log(
                //         'timeline, m.room.message = ',
                //         event.event.content.body
                //     );
                //     console.log('');
                //     console.log('');
                // }

              // console.log('timeline, m.room.message = ', event.event);
            }
        );


        // automatic accept an joining room invitation
        newClient.on('RoomMember.membership', async (event, member) => {
            if (
                member.membership === 'invite' &&
                member.userId === newClient.getUserId()
            ) {
                await newClient.joinRoom(member.roomId);
                // setting up of room encryption seems to be triggered automatically
                // but if we don't wait for it the first messages we send are unencrypted
                await newClient.setRoomEncryption(member.roomId, {
                    algorithm: 'm.megolm.v1.aes-sha2',
                });
                console.log('');
                console.log('>> Has join room = ', member.roomId);
                console.log('');

            }
        });

        newClient.onDecryptedMessage = message => {
            console.log('\n\n\n Got encrypted message: ', message);
        }

        newClient.on('Event.decrypted', async (e) => {
            const { content } = e.clearEvent;

            if (content !== undefined && content.msgtype !== 'm.bad.encrypted' && typeof content.body !== "undefined") {
                // console.log('my message is ', e.clearEvent);
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
    };

    return {
        loginMatrixServer,
        saveBlobUrlToFile,
        sendMessageToRoom,
        isLogin,
        setOnHavingNewMessage,
        setOnLogInResult,
        setHavingNewFile,
        getMatrixRooms,
        getHistory,
        reloginMatrixServer,
        getAvatar
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
