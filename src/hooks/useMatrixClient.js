import axios from 'axios';

const handleLoginResult = async (
    _isLogin,
    error,
    exportedDevice,
    accessToken
) => {};

const handleHavingNewFile = (sender, room, file) => {};

const handleHavingNewMessage = (sender, room, message) => {};

var client = null;
var didLogin = false;
var roomList = [];

var onHavingNewMessage = handleHavingNewMessage;
var onHavingNewFile = handleHavingNewFile;
var onLogInResult = handleLoginResult;

var numberHistoricMessages = 20;
var avatar = null;
const loginKey = 'open_source_video';

var savedData = localStorage.getItem(loginKey);

function useMatrixClient() {
    const resetValues = () => {
        client = null;
        didLogin = false;
        roomList = [];
        savedData = null;

        onHavingNewMessage = handleHavingNewMessage;
        onHavingNewFile = handleHavingNewFile;
        onLogInResult = handleLoginResult;

        numberHistoricMessages = 5;
        avatar = null;
    };

    const setOnLogInResult = (_onLogInResult) => {
        onLogInResult = _onLogInResult;
    };

    const setHavingNewFile = (_onHavingNewFile) => {
        onHavingNewFile = _onHavingNewFile;
    };

    const setOnHavingNewMessage = (_onHavingNewMessage) => {
        onHavingNewMessage = _onHavingNewMessage;
    };

    const setNumberHistoricMessages = (num) => {
        numberHistoricMessages = num;
    };

    const isHavingAuthentication = () => {
        return savedData ? true : false;
    };

    const setMatrixClientEvents = (newClient) => {
        const processContent = async (sender, room, content) => {
            if (onHavingNewMessage !== handleHavingNewMessage && content.body) {
                onHavingNewMessage(sender, room, content.body);
            }

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

                if (onHavingNewFile !== handleHavingNewFile)
                    onHavingNewFile(sender, room, {
                        fileType: content.info.mimetype,
                        fileUrl: blobURL,
                        fileName: content.body,
                    });
            }
        };

        newClient.once('sync', async (state, prevState, res) => {
            if (state === 'PREPARED') {
                didLogin = true;
                roomList = await newClient.getRooms();
                client = newClient;

                const exportedDevice = await newClient.exportDevice();

                localStorage.setItem(
                    loginKey,
                    JSON.stringify({
                        exportedDevice,
                        accessToken: newClient.accessToken,
                        homeServer: newClient.baseUrl,
                    })
                );

                if (onLogInResult !== handleLoginResult) {
                    //Return result
                    onLogInResult(
                        true,
                        null,
                        exportedDevice,
                        newClient.accessToken
                    );
                }

                getHistory(numberHistoricMessages);
            }
        });

        newClient.on('Room', async (room) => {
            roomList.push(room);
            //verifyAllDevicesInRoom(room);
        });

        newClient.on(
            'Room.timeline',
            async (event, room, toStartOfTimeline) => {
                try {
                    if (event.event.type === 'm.room.encrypted') {
                        const decryptMessage =
                            await newClient.crypto.decryptEvent(event);
                        //console.log(decryptMessage);
                        if (
                            decryptMessage &&
                            decryptMessage.clearEvent &&
                            decryptMessage.clearEvent.content &&
                            event.sender
                        ) {
                            processContent(
                                event.sender.userId,
                                event.sender.room,
                                decryptMessage.clearEvent.content
                            );
                        }
                        return;
                    }

                    if (event.getType() === 'm.room.message' && event.sender) {
                        processContent(
                            event.sender.userId,
                            event.sender.room,
                            event.event.content
                        );
                        return;
                    }
                } catch {
                    //console.error('#### ', error);
                }
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

        newClient.on('Room.receipt', async (event, room) => {});

        newClient.on('Event.decrypted', (e) => {});
    };

    const verifyAllDevicesInRoom = async (room) => {
        let members = (await room.getEncryptionTargetMembers()).map(
            (x) => x['userId']
        );

        if (members !== null) {
            console.log('members =', members);
            let memberkeys = await client.downloadKeys(members);

            if (memberkeys) {
                for (const userId in memberkeys) {
                    for (const deviceId in memberkeys[userId]) {
                        await client.setDeviceVerified(userId, deviceId);
                    }
                }
            }
        }
    };

    const getHistory = async (numOfHistory) => {
        for (let i = 0; i < roomList.length; i++)
            await client.scrollback(roomList[i], numOfHistory);
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

    const isLogin = async () => {
        if (didLogin === false && savedData) {

            let info = JSON.parse(savedData);
            const loginResult = await loginByAccessToken(
                info.homeServer,
                info.exportedDevice,
                info.accessToken
            );

            if (loginResult) return;
            else {
                console.log('remove localstorage', loginKey);
                localStorage.removeItem(loginKey);
            }

            return loginResult;
        }
        return didLogin;
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
                console.log('remove localstorage', loginKey);
                localStorage.removeItem(loginKey);
            }
        }

        loginByPassword(baseUrl, username, password);
    };

    const getMatrixRooms = () => {
        return roomList;
    };

    const getAvatar = async (userId) => {
        try {
            if (didLogin && client) {
                var profile = await client.getProfileInfo(userId, 'avatar_url');
                avatar = client.mxcUrlToHttp(profile.avatar_url);
                console.log('Avatar:::', avatar);
            }
        } catch (e) {
            console.log('error', e);
        }
        return avatar;
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

    const createRoom = async (roomID, usersToInvite) => {
        // if (roomID !== null) {
        //     // const {  roomID } = await client.createRoom({
        //     //     visibility: 'private',
        //     //     invite: usersToInvite,
        //     // });
        //     // await client.sendStateEvent(
        //     //     roomID,
        //     //     'm.room.encryption',
        //     //     ROOM_CRYPTO_CONFIG
        //     // );
        //     // await client.setRoomEncryption(roomID, ROOM_CRYPTO_CONFIG);
        //     // // Marking all devices as verified
        //     // let room = client.getRoom(roomID);
        //     // let members = (await room.getEncryptionTargetMembers()).map(
        //     //     (x) => x['userId']
        //     // );
        //     // let memberkeys = await client.downloadKeys(members);
        //     // for (const userId in memberkeys) {
        //     //     for (const deviceId in memberkeys[userId]) {
        //     //         await this.setDeviceVerified(userId, deviceId);
        //     //     }
        //     // }
        // }
        // return roomID;
    };

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

            console.log('Login successfully by token');
            return true;
        } catch (e) {
            console.log('Login by token fail', e);
            console.log('remove localstorage', loginKey);
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

        getMatrixRooms,
        //  getHistory,
        getAvatar,

        createRoom,

        isHavingAuthentication,
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
