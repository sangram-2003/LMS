import React from 'react'

function CategoryBtn({
    className="",
    category,
    onClick =()=>{},
    activeCategory,
    ...props
}) {
  return (
    <>
    
    <button 
    key={category}
    onClick={onClick}
    className={`px-5 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
      activeCategory === category 
      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
      : 'bg-white border border-gray-200 text-slate-600 hover:bg-gray-50'
    } ${className} `}
    {...props}
  >
    {category}
    </button>
    </>
  )
}

export default CategoryBtn