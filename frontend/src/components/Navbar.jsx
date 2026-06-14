import React from 'react'

function Navbar() {
    return (
        <nav className='bg-slate-800 text-white'>

            <div className='mycontainer flex justify-between items-center px-4 py-5 h-14 '>

                <div className=' logo font-bold text-white text-2xl'>

               <span className='text-green-500 text-2xl'>   &lt; </span>
                    
                    <span>Pass</span>

                   <span className='text-green-500 text-2xl'>OP /&gt; </span>
      
                 
                    </div>
                 
                <button className='text-white bg-green-700 m-0 p-0 rounded-md flex ring-white ring-1'>
                    <img className="invert p-0 w-16" src="/icons/github.svg" alt="github_logo"/> 
                    <span className='p-2'>Github</span>
                </button>
            </div>
        </nav>
    )
}

export default Navbar
