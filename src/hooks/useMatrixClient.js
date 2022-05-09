import axios from 'axios';
const ROOM_CRYPTO_CONFIG = { algorithm: 'm.megolm.v1.aes-sha2' };
const handleLoginResult = (_isLogin, error, exportedDevice, accessToken) => {};

const handleHavingNewFile = (sender, room, file, time) => {};

const handleHavingNewMessage = (sender, room, message, time) => {};

var client = null;
var didLogin = false;
var roomList = [];

var onHavingNewMessage = [];
onHavingNewMessage.push(handleHavingNewMessage);
var onHavingNewFile = [];
onHavingNewFile.push(handleHavingNewFile);
var onLogInResult = [];
onLogInResult.push(handleLoginResult);

const maxHistory = 20;
var numberHistoricMessages = maxHistory;
var avatar = null;
const loginKey = 'open_source_video';

var savedData = localStorage.getItem(loginKey);

var dictTimeStamp = {};

var isTesting = false;

function useMatrixClient() {
    const resetValues = () => {
        client = null;
        didLogin = false;
        roomList = [];
        savedData = null;
        dictTimeStamp = {};

        // onHavingNewMessage = handleHavingNewMessage;
        // onHavingNewFile = handleHavingNewFile;
        // onLogInResult = handleLoginResult;
        // onHavingNewMessage = [];
        // onHavingNewMessage.push(handleHavingNewMessage);
        // onHavingNewFile = [];
        // onHavingNewFile.push(handleHavingNewFile);
        // onLogInResult = [];
        // onLogInResult.push(handleLoginResult);

        numberHistoricMessages = maxHistory;
        avatar = null;
    };



    const setOnLogInResult = (_onLogInResult) => {
        onLogInResult.push(_onLogInResult);
    };

    const setHavingNewFile = (_onHavingNewFile) => {
        onHavingNewFile.push(_onHavingNewFile);
    };

    const setOnHavingNewMessage = (_onHavingNewMessage) => {
        onHavingNewMessage.push(_onHavingNewMessage);
    };

    const removeOnLogInResult = (_onLogInResult) => {
        const index = onLogInResult.indexOf(_onLogInResult);
        if (index > -1) {
            onLogInResult.splice(index, 1);
        }
    };

    const removeOnHavingNewFile = (_onHavingNewFile) => {
        const index = onHavingNewFile.indexOf(_onHavingNewFile);
        if (index > -1) {
            onHavingNewFile.splice(index, 1);
        }
    };


    const removeOnHavingNewMessage = (_onHavingNewMessage) => {
        const index = onHavingNewMessage.indexOf(_onHavingNewMessage);
        if (index > -1) {
            onHavingNewMessage.splice(index, 1);
        }
    };

    const setNumberHistoricMessages = (num) => {
        numberHistoricMessages = num;
    };

    const isHavingAuthentication = () => {
        return savedData ? true : false;
    };

    const decryptFile = async (sender, room, content, time) => {
        try {
            if (onHavingNewMessage.length > 0 && content.body) {
                
                for (let __onHavingNewMessage of onHavingNewMessage) {
                    __onHavingNewMessage(sender, room, content.body, time);
                }
            }

            if (typeof content.file !== 'undefined') {
                
                const response = await axios.get(
                    client.mxcUrlToHttp(content.file.url),
                    { responseType: 'arraybuffer' }
                );
                
                
                let decryptData = null; 

                decryptData = await decryptAttachment(
                    response.data,
                    content.file
                );
               
                const blobURL = await window.URL.createObjectURL(
                    new Blob([decryptData]),
                    { type: content.info.mimetype }
                );

                if (onHavingNewFile.length) {
                    for (let __onHavingNewFile of onHavingNewFile) {
                        try {
                            __onHavingNewFile(
                                sender,
                                room,
                                {
                                    fileType: content.info.mimetype,
                                    fileUrl: blobURL,
                                    fileName: content.body,
                                },
                                time
                            );
                        }catch(e) {
                            console.log('currentRoom.roomId 4',e)
                        }

                    }
                }
            }
        } catch (e) {
            console.log('#error',e)
            localStorage.removeItem(loginKey);
            resetValues();
        }
    };
    const decapsulateEvent = (e) => {
        if (e.claimedEd25519Key !== null) {
            if (
                onHavingNewMessage.length > 0 &&
                e.clearEvent.type === 'm.room.message'
            ) {
                for (let __onHavingNewMessage of onHavingNewMessage) {
                    __onHavingNewMessage(
                        e.sender.userId,
                        e.sender.roomId,
                        e.clearEvent.content.body,
                        e.event.origin_server_ts
                    );
                }

                // console.log('currentRoom.roomId 3', e.sender.room);
                decryptFile(
                    e.sender.userId,
                    e.sender.roomId,
                    e.clearEvent.content,
                    e.event.origin_server_ts
                );
            }
        } else {
            decryptEvent(e);
        }
    };
    const decryptEvent = async (e) => {
        if (client) {
            try {
                if (e.event.type === 'm.room.encrypted') {
                    const decryptMessage = await client.crypto.decryptEvent(e);
                    // console.log('===>>>',decryptMessage,e);
                    if (
                        decryptMessage &&
                        decryptMessage.clearEvent &&
                        decryptMessage.clearEvent.content &&
                        e.sender
                    ) {
                        if (
                            typeof dictTimeStamp[e.event.origin_server_ts] ===
                            'undefined'
                        ) {
                            dictTimeStamp[e.event.origin_server_ts] =
                                e.event.origin_server_ts;
                            //  console.log('currentRoom.roomId 4', e);
                            decryptFile(
                                e.sender.userId,
                                e.sender.roomId,
                                decryptMessage.clearEvent.content,
                                e.event.origin_server_ts
                            );

                            const room = client.getRoom(e.sender.roomId);
                            let found = false;

                            if (room && room.timeline) {
                                for (let i = 0; i < room.timeline.length; i++) {
                                    if (
                                        room.timeline[i]
                                            .event_origin_server_ts ===
                                        e.event.origin_server_ts
                                    ) {
                                        found = true;
                                        room.timeline[i].clearEvent =
                                            decryptMessage.clearEvent;
                                        room.timeline[i].claimedEd25519Key =
                                            decryptMessage.claimedEd25519Key;
                                        room.timeline[i].senderCurve25519Key =
                                            decryptMessage.senderCurve25519Key;
                                    }
                                }
                                if (found === false) {
                                    e.clearEvent = decryptMessage.clearEvent;
                                    e.claimedEd25519Key =
                                        decryptMessage.claimedEd25519Key;
                                    e.senderCurve25519Key =
                                        decryptMessage.senderCurve25519Key;
                                    room.timeline.push(e);
                                }
                            }
                        }
                    }
                }
                if (
                    e.getType() === 'm.room.message' &&
                    e.sender &&
                    e.event.origin_server_ts
                ) {
                    decryptFile(
                        e.sender.userId,
                        e.sender.roomId,
                        e.event.content,
                        e.event.origin_server_ts
                    );
                    return;
                }
            } catch (error) {

                console.error('#### ', error);
                
            }
        }
    };

    const forgetRoom = async (roomID) => {
        if (client) {
            await client.forget(roomID, true);
        }
    };

    const setMatrixClientEvents = (newClient) => {
        newClient.once('sync', async (state, prevState, res) => {
            if (state === 'PREPARED') {
                client = newClient;

                didLogin = true;
                roomList = await newClient.getRooms();

                //  client = newClient;

                const exportedDevice = await newClient.exportDevice();

                localStorage.setItem(
                    loginKey,
                    JSON.stringify({
                        exportedDevice,
                        accessToken: newClient.accessToken,
                        homeServer: newClient.baseUrl,
                    })
                );
                
                if (onLogInResult.length > 0) {
                 
                    //Return result
                    for (let __onLogInResult of onLogInResult) {
                        __onLogInResult(
                            true,
                            null,
                            exportedDevice,
                            newClient.accessToken
                        );
                    }
                }
                try {
                   
                    for (let i = 0; i < roomList.length; i++) {
                        const members = roomList[i].getMembers();
                        for (let j = 0; j < members.length; j++) {
                            try {
                                client.downloadKeys([members[j].userId]);
                            } catch {}
                        }
                    }
                } catch (err) {
                    console.log('uploadKeys key error', err);
                }

                try {
                    await newClient.uploadKeys();
                } catch (err) {
                    console.log('##error', err);
                }

                //GetHistory
                try {
                    const roomList = await newClient.getRooms();
                    for (let i = 0; i < roomList.length; i++) {
                        try {
                            client.scrollback(
                                roomList[i],
                                numberHistoricMessages
                            );
                        } catch {}
                    }
                } catch (err) {
                    console.log('##error', err);
                }
            }
        });

        newClient.on('Room', async (room) => {
            roomList.push(room);
            //verifyAllDevicesInRoom(room);
        });

        newClient.on('Room.timeline', async (e, room, toStartOfTimeline) => {
            decryptEvent(e);
        });

        // automatic accept an joining room invitation
        newClient.on('RoomMember.membership', async (event, member) => {
            if (
                member.membership === 'invite' &&
                member.userId === newClient.getUserId()
            ) {
                await newClient.joinRoom(member.roomId);
            }

            if (
                member.membership === 'join' &&
                member.userId !== (await newClient.getUserId())
            ) {
                try {
                 
                    const userKey = await client.downloadKeys([member.userId]);
                 
                    if (userKey) {
                        for (const deviceId in userKey[member.userId]) {
                 
                            await client.setDeviceVerified(
                                member.userId,
                                deviceId
                            );
                        }
                    }
                } catch (error) {
                    console.log('#error', error);
                }
            }
        });

        newClient.on('Room.receipt', async (event, room) => {});

        newClient.on('Event.decrypted', async (e) => {
            // try {
            //     if (e.clearEvent && e.sender && e.event.origin_server_ts) {
            //         console.log('message', e);
            //         if (
            //             e.clearEvent.content &&
            //             e.clearEvent.content.msgtype === 'm.bad.encrypted'
            //         ) {
            //             if (e.event.type === 'm.room.encrypted') {
            //                 console.log('decrypt-again');
            //                 const decryptMessage =
            //                     await newClient.crypto.decryptEvent(e);
            //                 console.log(
            //                     'decrypt-again-result:',
            //                     decryptMessage
            //                 );
            //                 if (
            //                     decryptMessage &&
            //                     decryptMessage.clearEvent &&
            //                     decryptMessage.clearEvent.content &&
            //                     e.sender
            //                 ) {
            //                     if (
            //                         typeof dictTimeStamp[
            //                             e.event.origin_server_ts
            //                         ] === 'undefined'
            //                     ) {
            //                         dictTimeStamp[e.event.origin_server_ts] =
            //                             e.event.origin_server_ts;
            //                         processContent(
            //                             e.sender.userId,
            //                             e.sender.room,
            //                             decryptMessage.clearEvent.content,
            //                             e.event.origin_server_ts
            //                         );
            //                     }
            //                 }
            //                 return;
            //             }
            //         } else {
            //             if (
            //                 typeof dictTimeStamp[e.event.origin_server_ts] ===
            //                 'undefined'
            //             ) {
            //                 dictTimeStamp[e.event.origin_server_ts] =
            //                     e.event.origin_server_ts;
            //                 processContent(
            //                     e.sender.userId,
            //                     e.sender.room,
            //                     e.clearEvent.content,
            //                     e.event.origin_server_ts
            //                 );
            //             }
            //         }
            //     }
            // } catch (e) {
            //     console.log('#error =', e);
            // }
        });
    };

    const verifyAllDevicesInRoom = async (room) => {
        let members = (await room.getEncryptionTargetMembers()).map(
            (x) => x['userId']
        );

        if (members !== null) {
        
            let memberkeys = await client.downloadKeys([members]);

            if (memberkeys) {
                for (const userId of memberkeys) {
                    for (const deviceId in memberkeys[userId]) {
                        await client.setDeviceVerified(userId, deviceId);
                    }
                }
            }
        }
    };

    const getHistory = async (roomId) => {
        if (client) {
            const rooms = await client.getRooms();
            dictTimeStamp = {};

            for (let i = 0; i < rooms.length; i++) {
                if (rooms[i].roomId === roomId) {
                    for (let j = 0; j < rooms[i].timeline.length; j++) {
                        decapsulateEvent(rooms[i].timeline[j]);
                    }
                }
            }
        }
    };

    const getKeyByEvent = (e) => {
        const allDeviceIDs = Object.keys(
            client.crypto.deviceList.devices[e.sender.userId]
        );
        const keyList = [];

        for (let i = 0; i < allDeviceIDs.length; i++) {
            const deviceId = allDeviceIDs[i];
            const ed25519 =
                client.crypto.deviceList.devices[e.sender.userId][deviceId]
                    .keys['ed25519:' + deviceId];
            const curve25519 =
                client.crypto.deviceList.devices[e.sender.userId][deviceId]
                    .keys['curve25519:' + deviceId];

            keyList.push({ deviceId, ed25519, curve25519 });
        }

        return keyList;
    };

    const isLogin = () => {
        return client !== null;
    };

    const testLogin = async () => {
       
        if (isTesting === false && didLogin === false && savedData) {
            isTesting = true;
            let info = JSON.parse(savedData);

            const loginResult = await loginByAccessToken(
                info.homeServer,
                info.exportedDevice,
                info.accessToken
            );

            if (loginResult) {
                isTesting = false;
                return true;
            } else {
               
                localStorage.removeItem(loginKey);
                isTesting = false;
                return loginResult;
            }
        }
        isTesting = false;
        return false;
    };

    const logoutMatrixServer = () => {
        try {
            if (client !== null) {
                client.removeAllListeners();
                client.stopClient();

                localStorage.removeItem(loginKey);
                resetValues();
            }
        } catch (e) {
            localStorage.removeItem(loginKey);
            resetValues();
        }
    };

    const loginMatrixServer = async (baseUrl, username, password) => {
        savedData = localStorage.getItem(loginKey);

        if (savedData) {
            let info = JSON.parse(savedData);

            const loginResult = await loginByAccessToken(
                info.homeServer,
                info.exportedDevice,
                info.accessToken
            );
          

            if (loginResult) return;
            else {
          
                localStorage.removeItem(loginKey);
                resetValues();
            }
        }

        loginByPassword(baseUrl, username, password);
    };

    const getMatrixRooms = async () => {
        if (client) {
            return await client.getRooms();
        }
        return null;
    };

    const getAvatar = async () => {
        if (client) {
           
            var profile = await client.getProfileInfo(
                await client.getUserId(),
                'avatar_url'
            );
            avatar = await client.mxcUrlToHttp(profile.avatar_url);
        }

        return avatar;
    };

    const getUserId = async () => {
        if (client) {
            return await client.getUserId();
        }
        return null;
    };

    const getDisplayName = async () => {
        if (client) {
            const { displayName } = await client.getUser(
                await client.getUserId()
            );
            return displayName;
        }

        return '-';
    };

    const getRoomIdByName = async (name) => {
        if (client) {
            const rooms = await client.getRooms();

            for (let i = 0; i < rooms.length; i++) {
                if (rooms[i].name === name) {
                    return rooms[i].roomId;
                }
            }
        }
        return null;
    };

    // const getHistory = async (roomID, limit = 30) => {
    //     try {
    //         if (didLogin && client) {
    //             for (let i = 0; i < roomList.length; i++) {
    //                 console.log('roomList[i].roomId', roomList[i]);

    //                 if (roomList[i].roomId === roomID) {
    //                     var messageEvent = await client.scrollback(
    //                         roomList[i],
    //                         limit
    //                     );
    //                     if (messageEvent !== null) {
    //                         return messageEvent.timeline
    //                             .filter(
    //                                 (e) =>
    //                                     e.clearEvent !== null &&
    //                                     e.clearEvent.content !== null
    //                             )
    //                             .map((e) => e.clearEvent);
    //                     }
    //                 }

    //                 //for (let j = 0; j < rooms[i].timeline.length; j++) {
    //                 //    console.log(rooms[i].timeline[j].getContent());
    //                 //}
    //             }
    //         }
    //     } catch (e) {
    //         console.log('error', e);
    //     }
    // };

    const createRoom = async (roomName, _private = true) => {
        if (client) {
            const room = await client.createRoom({
                visibility: _private ? 'private' : 'public',
                name: roomName,
            });

            await client.sendStateEvent(
                room.room_id,
                'm.room.encryption',
                ROOM_CRYPTO_CONFIG
            );

            await client.setRoomEncryption(room.room_id, ROOM_CRYPTO_CONFIG);

            return room.room_id;
        }
        return null;
    };

    const inviteUserToRoom = async (userId, roomId) => {
        if (client) {
            const result = await client.invite(roomId, userId);
            return result;
        }
        return null;
    };

    const sendMessageToRoom = async (roomId, message) => {
        try {
            
            if (client) {
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

    const loginByAccessToken = async (baseUrl, exportedDevice, accessToken) => {
        console.log('\n\n\nLogging by access token\n\n\n');
        let newClient = null;

        try {
            newClient = new window.matrixClient.createClient({
                baseUrl,
                deviceToImport: exportedDevice,
                accessToken: accessToken,
                sessionStore: new window.matrixClient.WebStorageSessionStore(
                    window.localStorage
                ),
                cryptoStore: new window.matrixClient.IndexedDBCryptoStore(),
                // cryptoStore: new window.matrixClient.MemoryCryptoStore(),
            });

            newClient.accessToken = accessToken;
            newClient.deviceId = exportedDevice.deviceId;

            // newClient.sessionStore =
            //     await new window.matrixClient.WebStorageSessionStore(
            //         window.localStorage
            //     );

            // newClient.cryptoStore =
            //      new window.matrixClient.MemoryCryptoStore();

            // newClient.roomList.cryptoStore =
            //      new window.matrixClient.MemoryCryptoStore();

            // newClient.accessToken = accessToken;
            // newClient.deviceId = exportedDevice.deviceId;

            await newClient.initCrypto();
            // newClient.cryptoStore =
            //     await new window.matrixClient.MemoryCryptoStore();
            await newClient.setGlobalErrorOnUnknownDevices(false);
            await newClient.startClient();

            setMatrixClientEvents(newClient);

            return true;
        } catch (e) {
            localStorage.removeItem(loginKey);
            resetValues();
            return false;
        }
    };

    const loginByPassword = async (baseUrl, userId, password) => {
        console.log('\n\nLogging by password\n\n');

        let newClient = null;
        await window.Olm.init();

        try {
            newClient = window.matrixClient.createClient(baseUrl);

            //Create stores
            newClient.sessionStore =
                new window.matrixClient.WebStorageSessionStore(
                    window.localStorage
                );
            newClient.cryptoStore =
                new window.matrixClient.IndexedDBCryptoStore();
            //    new window.matrixClient.MemoryCryptoStore();
            //new window.matrixClient.IndexedDBCryptoStore(window.indexedDB,"OpenSourceVideosCryptoStore");

            const info = await newClient.login('m.login.password', {
                user: userId,
                password: password,
            });

            newClient.roomList.cryptoStore =
                new window.matrixClient.MemoryCryptoStore();

            newClient.accessToken = info.access_token;
            newClient.deviceId = info.device_id;

            await newClient.initCrypto();
            await newClient.setGlobalErrorOnUnknownDevices(false);
            await newClient.startClient();

            setMatrixClientEvents(newClient);

            return true;
        } catch (e) {
            if (onLogInResult) onLogInResult(false, e, null, null);
            return false;
        }
    };

    const setDisplayName = async (newName) => {
        if (client) {
            await client.setDisplayName(newName);
        }
    };

    const setAvatar = async (fileName, fileContent) => {
        if (client) {
            const url = await uploadFile(fileName, fileContent);

            if (url) await client.setAvatarUrl(url);
        }
    };

    const leaveRoom = async (roomId) => {
        if (client) {
            await client.leave(roomId);
        }
    };

    const banUserFromRoom = async (roomId, userId, reason) => {
        if (client) {
            await client.ban(roomId, userId, reason);
        }
    };

    const unbanUserFromRoom = async (roomId, userId) => {
        if (client) {
            await client.unban(roomId, userId);
        }
    };

    const kickUserFromRoom = async (roomId, userId, reason) => {
        if (client) {
            await client.kick(roomId, userId, reason);
        }
    };

    const uploadFile = async (fileName, stream) => {
        if (client) {
            const result = await client.uploadContent({
                stream: stream,
                name: fileName,
            });

            return result;
        }
        return null;
    };

    return {
        loginMatrixServer,
        logoutMatrixServer,

        saveBlobUrlToFile,

        sendMessageToRoom,

        isLogin,

        setOnHavingNewMessage,
        setOnLogInResult,
        setHavingNewFile,
        setNumberHistoricMessages,
        setDisplayName,
        setAvatar,

        getMatrixRooms,
        getHistory,
        getAvatar,
        getDisplayName,
        getUserId,
        getRoomIdByName,
        createRoom,

        isHavingAuthentication,
        testLogin,

        inviteUserToRoom,
        uploadFile,
        kickUserFromRoom,
        leaveRoom,
        banUserFromRoom,
        unbanUserFromRoom,
        forgetRoom,
        removeOnLogInResult,
        removeOnHavingNewFile,
        removeOnHavingNewMessage
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
