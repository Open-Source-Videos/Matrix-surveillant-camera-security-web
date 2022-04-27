import React from "react";

export const ModalPopUp = ({onClickPause}) => {
    return (
            <>
                <div
                className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                >
                <div className="relative w-auto my-6 mx-auto max-w-3xl">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">

                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                        <h3 className="text-3xl font-semibold"> Video </h3>
                        <button
                            className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                            onClick={() => {console.log("ENTER COMPONENT");onClickPause()}}
                        >
                            <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                ×
                            </span>
                        </button>
                    </div>

                    <div className="relative p-6 flex-auto">
                        <div
                            className="flex justify-center px-2"
                            key={1}
                        >
                            <video
                                width="500"
                                height="500"
                                controls
                                autoplay
                            >
                                <source
                                    src={"testvideo.mp4"}
                                    type="video/mp4"
                                />
                            </video>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
                <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
            </>
    );
}