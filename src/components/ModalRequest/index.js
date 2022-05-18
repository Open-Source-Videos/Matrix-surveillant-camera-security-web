import { useState } from 'react'
import { Dialog } from '@headlessui/react'

export const ModalRequest = ({
    isOpen, 
    onClickClose,
    dialogTitle,
    dialogBody,
    requestAction
}) => {
    // let [isOpen, setIsOpen] = useState(true)
    /*open={isOpen} 
    onClose={() => setIsOpen(false)}*/

    const bg_gradient = " bg-gradient-to-r from-orange-400 to-rose-400 hover:bg-orange-200 ";
    const btn_class_primary= "m-2 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-orange-400 to-rose-400 hover:bg-orange-100 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
    const btn_class_outline = bg_gradient + " m-2 relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-orange-500 rounded-lg group group-hover:from-orange-400 group-hover:to-rose-400 hover:text-white focus:ring-4 focus:outline-none focus:ring-rose-200 "
    const btn_text_span_outline = "w-full relative p-2 transition-all ease-in duration-75 bg-white hover:bg-gradient-to-r from-orange-400 to-rose-400 rounded-md group-hover:bg-opacity-0"

    return (
        <Dialog 
            open={isOpen} 
            onClose={onClickClose}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
        >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" ></div>
            <div className="flex flex-col z-50 bg-white text-gray-800 w-96 p-4 rounded-2xl">
				<Dialog.Overlay />

				<Dialog.Title className="text-gray-700 text-xl">
				    {dialogTitle}
				</Dialog.Title>

				<>
                    {dialogBody}
                </>

                <div className="grid grid-cols-1 md:grid-cols-2 border-none border-2 border-t-red-300 border-r-white border-l-white border-b-white mt-3 pt-2">
                    <button
                        className={`${btn_class_outline} `}
                        onClick={requestAction}
                    >
                        <span className={btn_text_span_outline}>
                            
                            Request
                        </span>
                    </button>

                    <button
                        className={`${btn_class_primary}`}
                        onClick={onClickClose}
                    >
                        Cancel
                    </button>
                </div>
			</div>
        </Dialog>
    )
}