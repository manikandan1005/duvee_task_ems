import Link from 'next/link'
import React from 'react'

export default function Sidebar() {
  const menuItem = [
    { label: "Employees", link: "/employees" },
    { label: "Inbox", link: "" },
    { label: "Addences", link: "" },
    { label: "Leave Request", link: "" },
    { label: "Profile", link: "/profile" }
  ]
  return (
    <div className='w-60 bg-black min-h-screen text-white py-10 px-6'>
      <div className='flex gap-6 flex-col'>
        {
          menuItem.map(i => (
            i.link ? (
              <Link href={i.link} key={i.label} className="hover:text-blue-400 transition-colors">
                {i.label}
              </Link>
            ) : (
              <span key={i.label} className="text-gray-500 cursor-not-allowed">
                {i.label}
              </span>
            )
          ))
        }
      </div>
    </div>
  )
}
