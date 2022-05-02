import { Redirect } from 'react-router-dom';
import useMatrixClient from '../hooks/useMatrixClient';
import TopNavBar from '../components/TopNavBar';
import { 
	useState,
	useEffect
} from 'react';


const ProfileView = ({ avatar }) => {
    return (
		<>
			<main className="profile-page">
				<section className="relative block" style={{ height: "530px" }}>
					<div
						className="absolute top-0 w-full h-full bg-center bg-cover bg-amber-200"
						style={{
							backgroundImage: "url('/profile_page.svg')",
							backgroundPosition: "center",
							backgroundSize: "contain",
							backgroundRepeat: "no-repeat"
						}}
					>
					</div>
					<div
						className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden"
						style={{ height: "70px" }}
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
							>
							</polygon>
						</svg>
					</div>
				</section>
				<section className="relative py-16 bg-white">
					<div className="container mx-auto px-4">
						<div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
							<div className="px-6">
								<div className="flex flex-wrap justify-center">
									<div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
										<div className="relative">
											<img
												alt="..."
												src={avatar}
												className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16"
												style={{ maxWidth: "150px" }}
											/>
										</div>
									</div>
								</div>
								<div className="text-center mt-12">
									<h3 className="text-4xl font-semibold leading-normal mb-2 text-gray-800 pt-5">
										Minh Nguyen
									</h3>
									<div className="text-sm leading-normal mt-0 mb-2 text-gray-500 font-bold uppercase">
										<i className="fas fa-map-marker-alt mr-2 text-lg text-gray-500"></i>{" "}
										Portland, Oregon
									</div>
									<div className="mb-2 text-gray-700 mt-10">
										<i className="fas fa-briefcase mr-2 text-lg text-gray-500"></i>
										Fond-end Lead - Golden Tiger Team
									</div>
									<div className="mb-2 text-gray-700">
										<i className="fas fa-university mr-2 text-lg text-gray-500"></i>
										@minh25:matrix.org
									</div>
								</div>
								<div className="mt-10 py-10 border-t border-gray-300 text-center">
									<div className="flex flex-wrap justify-center">
										<div className="w-full lg:w-9/12 px-4">
											<p className="mb-4 text-lg leading-relaxed text-gray-800">
												An artist of considerable range, Jenna the name taken by
												Melbourne-raised, Brooklyn-based Nick Murphy writes,
												performs and records all of his own music, giving it a
												warm, intimate feel with a solid groove structure. An
												artist of considerable range.
											</p>
											<a
												href="#pablo"
												className="font-normal text-pink-500"
												onClick={e => e.preventDefault()}
											>
												Show more
											</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				<img 
					src={'/wave-haikei.svg'} 
					alt="footer" 
					width={"100%"} 
				/>
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
}

const Profile = () => {
	const { isLogin, getAvatar } = useMatrixClient();
	const [avatar, setAvatar] = useState(null);

	useEffect(() => {
		const get_avatar = () => {
			const local_storage_item = JSON.parse(window.localStorage.getItem('matrix_account'));
			const exported_device = local_storage_item.exportedDevice;
			const user_id = exported_device.userId;
	
			(async()=>{
				try {
					let profileAvatar = await getAvatar(user_id);
					if (profileAvatar === null || profileAvatar === "") {
						setAvatar(null)
					} else {
						setAvatar(profileAvatar);
					}
				} catch (e) {
					console.log('error', e);
					setAvatar(null);
				}
			})();
		}

		get_avatar();
	}, [avatar, getAvatar]);

	return (
		<>
			{isLogin() ? (
				<div className="App">
					<TopNavBar />
					{
						avatar ? (
							<ProfileView avatar={avatar} />
						) : (
							<ProfileView avatar={"logo_profile_static_avatar.svg"} />
						)
					}
				</div>
			) : (
				<Redirect to="/403" />
			)}
		</>
	);
}

export default Profile;
