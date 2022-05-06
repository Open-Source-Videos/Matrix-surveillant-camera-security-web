import React from "react";
import { useState, useEffect } from 'react';
import TopNavigationBar from '../components/TopNavigationBar';
import { PaperClipIcon } from '@heroicons/react/solid'
import useMatrixClient from "../hooks/useMatrixClient";
import Page403 from "./Page403";

const ProfileView = () => {
  return (
    <>
    <main className="profile-page">
      <section className="relative block" style={{ height: "500px" }}>
        <div
          className="absolute top-0 w-full h-full bg-center bg-cover bg-amber-200"
          style={{
            backgroundImage:"url('/profile_page.svg')",
            backgroundPosition: 'center',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
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
            ></polygon>
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
                 
                  </div>
                </div>
                <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
                  <div className="py-6 px-3 mt-32 sm:mt-0">
                   
                  </div>
                </div>
                <div className="w-full lg:w-4/12 px-4 lg:order-1">
                  <div className="flex justify-center py-4 lg:pt-4 pt-8">
                    <div className="mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-gray-700 pl-6">
                     
                      </span>
                      
                    </div>
                    <div className="mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-gray-700 pl-5">
                       
                      </span>
                     
                    </div>
                    <div className="lg:mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-gray-700 pl-3">
                     
                      </span>
                     
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-5 sm:px-6">
                    <h1 className="text-xlg leading-8 font-medium text-gray-1000">Settings</h1>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and application.</p>
              </div>

              <div className="border-t border-gray-200">
                    <dl>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">HomeServer</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">matrix.pdxinfosec.org</dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Account</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">@test003:pdxinfosec.org</dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Email address</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">margotfoster@example.com</dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Room ID</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">!bdQMmkTBTMqUPAOvms:pdxinfosec.org</dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">About</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa consequat. Excepteur
                        qui ipsum aliquip consequat sint. Sit id mollit nulla mollit nostrud in ea officia proident. Irure nostrud
                        pariatur mollit ad adipisicing reprehenderit deserunt qui eu.
                        </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Attachments</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <ul role="list" className="border border-gray-200 rounded-md divide-y divide-gray-200">
                            <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                            <div className="w-0 flex-1 flex items-center">
                                <PaperClipIcon className="flex-shrink-0 h-5 w-5 text-gray-400" aria-hidden="true" />
                                <span className="ml-2 flex-1 w-0 truncate">resume_back_end_developer.pdf</span>
                            </div>
                            <div className="ml-4 flex-shrink-0">
                                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Download
                                </a>
                            </div>
                            </li>
                            <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                            <div className="w-0 flex-1 flex items-center">
                                <PaperClipIcon className="flex-shrink-0 h-5 w-5 text-gray-400" aria-hidden="true" />
                                <span className="ml-2 flex-1 w-0 truncate">coverletter_back_end_developer.pdf</span>
                            </div>
                            <div className="ml-4 flex-shrink-0">
                                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Download
                                </a>
             </div>
            </li>
          </ul>
        </dd>
      </div>
    </dl>
  </div>


            </div>
          </div>
        </div>
      </section>
      <img src={'/wave-haikei.svg'} alt="footer" width={'100%'} />
      <footer className="relative bg-gray-300 pt-8 pb-6">
      <hr className="my-6 border-gray-400" />
      <div className="flex flex-wrap items-center md:justify-between justify-center">
        <div className="w-full md:w-4/12 px-4 mx-auto text-center">
          <div className="text-sm text-gray-600 font-semibold py-1">
            Open Camera App {new Date().getFullYear()}{" "}By {" "}
            <a
              href="https://www.creative-tim.com"
              className="text-gray-600 hover:text-gray-900"
            >
              Golden Tiger Team
            </a>.
          </div>
        </div>
      </div>
      </footer>
    </main>
    </>
  );
};

const Setting = () => {
    const {isLogin, testLogin} = useMatrixClient();
    const [yesLogin, setYesLogin] = useState(false);

    useEffect(() => {
      (async () => {
          if (isLogin() === false) {
              console.log('Run test login');
              setYesLogin(await testLogin());
          }
          setTimeout(() => {
            setYesLogin(isLogin());
          }, 500);
        })();
      },[isLogin, testLogin]);


    return (
      <>
        {yesLogin ? (
          <div className="App">
            <TopNavigationBar />
            <ProfileView></ProfileView>
          </div>
        ) : (
          <Page403/>
        )}

      </>

    );
      
  };

  export default Setting;