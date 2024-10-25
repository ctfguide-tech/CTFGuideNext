import React, { useState, useEffect } from 'react';

const StudioEditor = () => {
    const [json, setJson] = useState([{}]);
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

    function addToJson(attribute, value) {
        setJson([...json, { [attribute]: value }]);
    }

    function insertComponent(component, value1, value2) {
        if (component === "markdown") {
            addToJson("markdown", value1);
        }
    }

    const handleDivClick = (event) => {
        event.preventDefault();
        setMenuPosition({ x: event.clientX - 20, y: event.clientY - 40 });
        setMenuVisible(true);
    };

    const handleMenuClick = () => {
        setMenuVisible(false);
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setMenuVisible(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <div className="editor-container text-white w-full h-full">
            <div className='grid grid-cols-6 h-full'>
                <div className='bg-neutral-900 border-r border-neutral-800 col-span-4'>
                    <div className='grid grid-cols-12'>
                        <div
                            className='col-span-12 pb-2 hover:border-4 hover:border-blue-500 '
                            onContextMenu={handleDivClick}
                        >
                            {/* Custom right-click style menu */}
                            {menuVisible && (
                                <div
                                    className={`absolute bg-neutral-900 text-black border-1 border-neutral-800 shadow-lg fade-in menu-no-pulse ${menuVisible ? 'menu-visible' : ''}`}
                                    style={{ top: menuPosition.y + 40, left: menuPosition.x - 10 }}
                                    onClick={handleMenuClick}
                                >
                                    <ul className='text-lg list-none mb-3'>
                                        <li className='pr-20 pl-4 py-3 text-lg font-bold bg-neutral-900 text-white'><i className='fa fa-mouse-pointer'></i> Interactive Components</li>
                                        <li className='py-2 border-b border-neutral-900 border-l-4 border-l-blue-500 hover:bg-neutral-700 cursor-pointer bg-neutral-800 pr-20 pl-4 text-white text-md'>
                                            <i className='fa fa-keyboard'></i> Markdown
                                        </li>
                                        <li className='py-2 border-b border-neutral-900 hover:bg-neutral-700 cursor-pointer bg-neutral-800 pr-20 pl-4 text-white text-md'>
                                            <i className='fa fa-check-square'></i> Multiple Choice
                                        </li>
                                        <li className='py-2 border-b border-neutral-900 hover:bg-neutral-700 cursor-pointer bg-neutral-800 pr-20 pl-4 text-white text-md'>
                                            <i className='fa fa-edit'></i> Open Ended
                                        </li>
                                        <li className='py-2 hover:opacity-75 cursor-pointer bg-black pr-20 pl-4 text-white text-md' style={{ fontFamily: '"Source Code Pro", Consolas, "Courier New", monospace' }}>
                                            <i className='fa fa-code'></i> Executable Snippet
                                        </li>
                                        <li className='py-1 bg-red-900/50 text-sm border-b border-neutral-900 hover:bg-red-800 cursor-pointer bg-neutral-800 pr-20 pl-4 text-white text-md'>
                                            <i className='fa fa-trash'></i> Delete Component
                                        </li>
                                    </ul>
                                    <div className='mx-auto text-center'> 
                                        <kbd className="ml-2 px-2 py-1 text-sm font-semibold text-neutral-200 bg-neutral-800 border border-neutral-700 rounded-lg shadow-outer text-sm">ESC</kbd> <span className='text-white'>to dismiss menu</span>
                                    </div>
                                    <div className='border-t border-red-400 mt-20'>
                                        <p className='text-red-500 px-2 font-bold'>Developer Options</p>
                                        <p className='text-white px-2'>ELEMENT JSON</p>
                                        <textarea className='w-full bg-black text-white h-40'>
                                            {JSON.stringify({ id: 1, props: [{
                                              "type": "spacer"
                                            }] }, null, 2)}
                                        </textarea>
                                        <br></br>
                                    </div>
                                </div>
                            )}

                            <div className='px-2 mt-2'>
                                <textarea className='w-full bg-neutral-800 m-0' >
                                    
                                </textarea>
                                <div className='w-fit px-4  m-0 bg-blue-900 '>
                                    <button>Preview</button>
                                </div>
                            </div>
                        </div>
                        <div className='py-10 col-span-4  hover:border-2 hover:border-dashed hover:border-blue-500'>
                         
                        </div>
                        <div className='py-10 col-span-4  hover:border-4 hover:border-dashed hover:border-blue-500'>
                           
                        </div>
                        <div className='py-10 col-span-8  hover:border-4 hover:border-dashed hover:border-blue-500'>
                            
                        </div>
                        <div className='py-10 col-span-4 hover:border-4 hover:border-dashed hover:border-blue-5000'>
                   
                        </div>
                        <div className='py-10 col-span-12  hover:border-4 hover:border-dashed hover:border-blue-500'>
                           
                        </div>
                        <div className='py-10 col-span-12 hover:border-4 hover:border-dashed hover:border-blue-500'>
                            
                        </div>
                    </div>
                    <div 
                        className='w-full h-1/7 py-3 mx-auto text-center bg-neutral-800 text-white absolute bottom-0' 
                    >
                        <div className='grid grid-cols-4 w-1/4 gap-x-4 text-center  mx-auto'>
                                <div className='bg-neutral-900'>
                                    1
                                </div>
                                <div className='bg-blue-800'>
                                    2
                                </div>
                                <div className='bg-neutral-900 '>
                                    3
                                </div>
                                <div className='bg-neutral-900'>
                                    +
                                </div>
                        </div>
                    </div>
                </div>
                <div className='bg-black h-full col-span-2'>
                                <div className='px-4'>
                                    <h1 className='text-xl mt-10'>What do you want the terminal to do on this page?</h1>

                                    <button className='mt-4 bg-neutral-900  py-2 border-b-4 border-neutral-800 hover:border-neutral-900 px-4 w-full'>Continue Terminal from page 1</button>
                                    <button className='mt-4 bg-neutral-900  py-2 border-b-4 border-neutral-800 hover:border-neutral-900 px-4 w-full'>Create a fresh terminal for this page</button>

                                </div>
                </div>
            </div>
        </div>
    );
};

export default StudioEditor;
