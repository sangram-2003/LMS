import React, { useState } from 'react'
import { NavLink } from "react-router-dom";


function Button(
{

        title="click Me",
        onClick=()=>{},
        link="#",
        className="",
        icon,
       ...props

}
) {
        const [isClick ,setIsClick]=useState(false);
        const handleClick =()=>{
        console.log(isClick , link);
        setIsClick((prev) => !prev);
       
     }
  return (

   
    <>
    <NavLink to={link}>
     <button 
        key={title}
        onClick={() => {
                        onClick();
                        handleClick();
                        }}
                 
  className={`px-5 flex justify-center  items-center gap-2 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all 
  ${isClick ? 'bg-blue-600 text-white' : 'bg-green-700 hover:bg-blue-500 text-white'} 
  ${className}`}
  {...props}
    
    >

<div className=''>
    {icon}
</div>
    {title}
</button>
    </NavLink>
     
    </>
  )
}

export default Button