import React, { 
	useEffect, 
	useState 
} from 'react';
const axios = require('axios');


const BASE_URL = 'https://matrix.pdxinfosec.org';
const PASSWORD = "G3Vsnzvr";
const USERNAME = "@test003:pdxinfosec.org";
const ROOM_ID = "!bdQMmkTBTMqUPAOvms:pdxinfosec.org";



function App() {
    const [listImageURL, setListImageURL] = useState([]);
    const [listVideoURL, setListVideoURL] = useState([]);
    useEffect(() => {
        (async () => {
            console.log('Start Matrix Client!');
            await window.Olm.init();
            const client = window.matrixClient.createClient(BASE_URL);
            client.sessionStore = new window.matrixClient.WebStorageSessionStore(
            	window.localStorage
            );

            client.cryptoStore = new window.matrixClient.MemoryCryptoStore();
            client.roomList.cryptoStore = new window.matrixClient.MemoryCryptoStore(
                window.localStorage
            );

            const info = await client.login('m.login.password', {
                user: USERNAME,
                password: PASSWORD,
            });

            client.accessToken = info.access_token;
            client.deviceId = info.device_id;

            await client.initCrypto();
            client.setGlobalErrorOnUnknownDevices(false);
            await client.startClient();

            client.on('event', (e) => {
                console.log('event = ', e);
            });

            client.on('Room.timeline', function(
                event,
                room,
                toStartOfTimeline
            ) {
                // we know we only want to respond to messages
                if (event.getType() !== 'm.room.message') {
                    return;
                }

                // we are only intested in messages from the test room, which start with "!"
                if (
                    event.getRoomId() === ROOM_ID &&
                    event.getContent().body[0] === '!'
                ) {
                    console.log('');
                    console.log('');
                    console.log(
                        'timeline, m.room.message = ',
                        event.event.content.body
                    );
                    console.log('');
                    console.log('');
                }
            });

            // automatic accept an joining room invitation
            client.on('RoomMember.membership', async (event, member) => {
                if (
                    member.membership === 'invite' &&
                    member.userId === client.getUserId()
                ) {
                    await client.joinRoom(member.roomId);
                    // setting up of room encryption seems to be triggered automatically
                    // but if we don't wait for it the first messages we send are unencrypted
                    await client.setRoomEncryption(member.roomId, {
                        algorithm: 'm.megolm.v1.aes-sha2',
                    });
                    console.log('');
                    console.log('>> Has join room = ', member.roomId);
                    console.log('');
                }
            });

            client.on('Event.decrypted', async (e) => {
                console.log(e);
                const { content } = e.clearEvent;

                if (content !== undefined) {
                    console.log('');
                    console.log('');
                    console.log('>>>>>receive message = ', content.body);
                    console.log('');
                    console.log('');

                    if (typeof content.file !== 'undefined') {
                        console.log(content.info);
                        console.log(content.file);
                        console.log(client.mxcUrlToHttp(content.file.url));

                        const response = await axios.get(
                            client.mxcUrlToHttp(content.file.url),
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

                        switch (content.info.mimetype) {
                            case 'image/jpeg':
                                listImageURL.push(blobURL);
                                setListImageURL([...listImageURL]);
                                break;
                            case 'video/mp4':
								listVideoURL.push(blobURL);
                                setListVideoURL([...listVideoURL]);
                                break;
                            default: {
                                saveByteArray(blobURL, content.body);
                            }
                        }
                    }
                }
            });
            console.log(client.getRoom());

            // await setTimeOut(
            //     setInterval(function() {
            //         client.sendEvent(
            //             ROOM_ID,
            //             'm.room.message',
            //             {
            //                 body: 'Test send and receive matrix from React.Js!',
            //                 msgtype: 'm.text',
            //             },
            //             '' //info.access_token
            //         );
            //     }, 5000)
            // );
        })();

        // setTimeout(() => {
        //     clearTimeout(timeOut);
        // }, 300000);
    }, [listImageURL, listVideoURL]);

    return (
        <div className="App">
            <header className="App-header">
				<div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
						{listImageURL.length > 0 ? (
							listImageURL.map((url, index) => {
								return (
									<div className="flex justify-center px-2" key={index}>
										<div className="flex flex-col md:flex-row md:max-w-xl rounded-lg bg-white shadow-lg lg:items-center">
											<img className="w-full h-50 md:h-77 lg:h-auto object-cover md:w-72 rounded-t-lg md:rounded-none md:rounded-l-lg" src={url} alt="" />
											<div className="p-6 flex flex-col justify-start">
												<h5 className="text-gray-900 text-lg font-medium mb-2">Garage View</h5>
												<p className="text-gray-700 text-base mb-4">Tue, Apr 12 2022 21:48:12</p>
												<div className="grid grid-cols-2 gap-2 md:grid-cols-1">
													<button type="button" className="bg-rose-500 text-white text-sm leading-6 font-medium py-2 px-3 rounded-lg border border-rose-500 inline-flex items-center justify-center">
														<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 22 22" stroke="currentColor" strokeWidth="2">
															<path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
															<path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
														</svg>
														<span>Watch</span>
													</button>
													<button className="bg-white hover:bg-rose-500 text-rose-500 hover:text-white text-sm leading-6 font-medium py-2 px-3 rounded-lg border border-rose-500 inline-flex items-center justify-center">
														<svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
															<path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/>
														</svg>
														<span>Download</span>
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
                    
					{listVideoURL.length > 0 ? (
                        listVideoURL.map((videoURL, index) => {
                            return (
								<video key={index} width="500" height="500" controls autoplay>
									<source src={videoURL} type="video/mp4" />
								</video>
							);
                        })
                    ) : (
                        <></>
                    )}

				<br/>
				<div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
					<div className="flex justify-center px-2">
						<div className="flex flex-col md:flex-row md:max-w-xl rounded-lg bg-white shadow-lg lg:items-center">
							<img className="w-full h-50 md:h-77 lg:h-auto object-cover md:w-72 rounded-t-lg md:rounded-none md:rounded-l-lg" src={"testimage.jpg"} alt="" />
							<div className="p-6 flex flex-col justify-start">
								<h5 className="text-gray-900 text-lg font-medium mb-2">Garage View</h5>
								<p className="text-gray-700 text-base mb-4">Tue, Apr 12 2022 21:48:12</p>
								<div className="grid grid-cols-2 gap-2 md:grid-cols-1">
									<button type="button" className="bg-rose-500 text-white text-sm leading-6 font-medium py-2 px-3 rounded-lg border border-rose-500 inline-flex items-center justify-center">
										<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 22 22" stroke="currentColor" strokeWidth="2">
											<path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
											<path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
										</svg>
										<span>Watch</span>
									</button>
									<button className="bg-white hover:bg-rose-500 text-rose-500 hover:text-white text-sm leading-6 font-medium py-2 px-3 rounded-lg border border-rose-500 inline-flex items-center justify-center">
										<svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
											<path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/>
										</svg>
										<span>Download</span>
									</button>
								</div>
							</div>
						</div>
					</div>
					<div className="flex justify-center px-2">
						<div className="flex flex-col md:flex-row md:max-w-xl rounded-lg bg-white shadow-lg lg:items-center">
							<img className="w-full h-50 md:h-77 lg:h-auto object-cover md:w-72 rounded-t-lg md:rounded-none md:rounded-l-lg" src={"testimage.jpg"} alt="" />
							<div className="p-6 flex flex-col justify-start">
								<h5 className="text-gray-900 text-lg font-medium mb-2">Garage View</h5>
								<p className="text-gray-700 text-base mb-4">Tue, Apr 12 2022 21:48:12</p>
								<div className="grid grid-cols-2 gap-2 md:grid-cols-1">
									<button type="button" className="bg-rose-500 text-white text-sm leading-6 font-medium py-2 px-3 rounded-lg border border-rose-500 inline-flex items-center justify-center">
										<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 22 22" stroke="currentColor" strokeWidth="2">
											<path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
											<path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
										</svg>
										<span>Watch</span>
									</button>
									<button className="bg-white hover:bg-rose-500 text-rose-500 hover:text-white text-sm leading-6 font-medium py-2 px-3 rounded-lg border border-rose-500 inline-flex items-center justify-center">
										<svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
											<path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/>
										</svg>
										<span>Download</span>
									</button>
								</div>
							</div>
						</div>
					</div>
					<div className="flex justify-center px-2">
						<div className="flex flex-col md:flex-row md:max-w-xl rounded-lg bg-white shadow-lg lg:items-center">
							<img className="w-full h-50 md:h-77 lg:h-auto object-cover md:w-72 rounded-t-lg md:rounded-none md:rounded-l-lg" src={"testimage.jpg"} alt="" />
							<div className="p-6 flex flex-col justify-start">
								<h5 className="text-gray-900 text-lg font-medium mb-2">Garage View</h5>
								<p className="text-gray-700 text-base mb-4">Tue, Apr 12 2022 21:48:12</p>
								<div className="grid grid-cols-2 gap-2 md:grid-cols-1">
									<button type="button" className="bg-rose-500 text-white text-sm leading-6 font-medium py-2 px-3 rounded-lg border border-rose-500 inline-flex items-center justify-center">
										<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 22 22" stroke="currentColor" strokeWidth="2">
											<path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
											<path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
										</svg>
										<span>Watch</span>
									</button>
									<button className="bg-white hover:bg-rose-500 text-rose-500 hover:text-white text-sm leading-6 font-medium py-2 px-3 rounded-lg border border-rose-500 inline-flex items-center justify-center">
										<svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
											<path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/>
										</svg>
										<span>Download</span>
									</button>
								</div>
							</div>
						</div>
					</div>
					<div className="flex justify-center px-2">
						<div className="flex flex-col md:flex-row md:max-w-xl rounded-lg bg-white shadow-lg lg:items-center">
							<img className="w-full h-50 md:h-77 lg:h-auto object-cover md:w-72 rounded-t-lg md:rounded-none md:rounded-l-lg" src={"testimage.jpg"} alt="" />
							<div className="p-6 flex flex-col justify-start">
								<h5 className="text-gray-900 text-lg font-medium mb-2">Garage View</h5>
								<p className="text-gray-700 text-base mb-4">Tue, Apr 12 2022 21:48:12</p>
								<div className="grid grid-cols-2 gap-2 md:grid-cols-1">
									<button type="button" className="bg-rose-500 text-white text-sm leading-6 font-medium py-2 px-3 rounded-lg border border-rose-500 inline-flex items-center justify-center">
										<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 22 22" stroke="currentColor" strokeWidth="2">
											<path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
											<path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
										</svg>
										<span>Watch</span>
									</button>
									<button className="bg-white hover:bg-rose-500 text-rose-500 hover:text-white text-sm leading-6 font-medium py-2 px-3 rounded-lg border border-rose-500 inline-flex items-center justify-center">
										<svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
											<path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/>
										</svg>
										<span>Download</span>
									</button>
								</div>
							</div>
						</div>
					</div>
					<div className="flex justify-center px-2">
						<div className="flex flex-col md:flex-row md:max-w-xl rounded-lg bg-white shadow-lg lg:items-center">
							<img className="w-full h-50 md:h-77 lg:h-auto object-cover md:w-72 rounded-t-lg md:rounded-none md:rounded-l-lg" src={"testimage.jpg"} alt="" />
							<div className="p-6 flex flex-col justify-start">
								<h5 className="text-gray-900 text-lg font-medium mb-2">Garage View</h5>
								<p className="text-gray-700 text-base mb-4">Tue, Apr 12 2022 21:48:12</p>
								<div className="grid grid-cols-2 gap-2 md:grid-cols-1">
									<button type="button" className="bg-rose-500 text-white text-sm leading-6 font-medium py-2 px-3 rounded-lg border border-rose-500 inline-flex items-center justify-center">
										<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 22 22" stroke="currentColor" strokeWidth="2">
											<path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
											<path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
										</svg>
										<span>Watch</span>
									</button>
									<button className="bg-white hover:bg-rose-500 text-rose-500 hover:text-white text-sm leading-6 font-medium py-2 px-3 rounded-lg border border-rose-500 inline-flex items-center justify-center">
										<svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
											<path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/>
										</svg>
										<span>Download</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
            </header>
        </div>
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
                .then(function(decrypted) {
                    return decrypted;
                })
                .catch(function(err) {
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

const saveByteArray = (function() {
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    return function(url, name) {
        a.href = url;
        a.download = name;
        a.click();
        window.URL.revokeObjectURL(url);
    };
})();

export default App;