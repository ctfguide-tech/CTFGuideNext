import React, { useState } from 'react';

const StudioEditor = () => {
    const [json, setJson] = useState([{}]);
  function addToJson(attribute, value) {
    setJson([...json, {[attribute]: value}]);
  }



  function insertComponent(component, value1, value2) {
    if(component === "markdown") {
      addToJson("markdown", value1);
    }

    
  }



  return (
    <div className="editor-container text-white  w-full h-full" >
    
        <div className='grid grid-cols-6 h-full'> 

            <div className='bg-neutral-900 border-r border-neutral-800 col-span-4'>
               
               
               <div className='grid grid-cols-12'>



                    <div className='py-10 col-span-4 hover:border-4 hover:border-dashed hover:border-blue-500'>
                
                    </div>
                    <div className='py-10 col-span-4  hover:border-4 hover:border-dashed hover:border-blue-500'>
                     
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

               <textarea className='w-full h-full bg-neutral-900 text-white' placeholder='AUTO GENERATED JSON HERE'>

               </textarea>




            </div>


            <div className='bg-black h-full col-span-2'>
                <h1>Studio Editor</h1>
            </div>


        </div>
    </div>
  );
};

export default StudioEditor;
