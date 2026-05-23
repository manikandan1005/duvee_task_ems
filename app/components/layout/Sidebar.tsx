import Link from 'next/link'
import React from 'react'

export default function Sidebar() {
  const menuItem =[{label:"Employees",link:"/employees"},
                    {label:"Inbox",link:"",},
                    {label:"Addences",link:""},
                    {label:"Leave Request",link:""}
  ]
  return (
    <div className='w-60 bg-black min-h-screen text-white py-10'>
      <div className='flex gap-10 flex-col'>
        {
          menuItem.map(i=>(
            <Link href={i.link} key={i.label}>{i.label}</Link>
          ))
        }
      </div>
    </div>
  )
}
