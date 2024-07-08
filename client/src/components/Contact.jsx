/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom';

export default function Contact({listing}) {
  const [landlord,setLandlord]=useState(null)
  const [message,setMessage]=useState('');
  console.log("this is listing",listing);
  useEffect(()=>{

  const fetchLandlord=async()=>{
    try {
      const res=await fetch(`/api/user/${listing.
        userRef
        }`);
      const data=await res.json();
      console.log("this is data",data)
      setLandlord(data);
    } catch (error) {
      console.log(error);
    }
  }
  fetchLandlord()
  },[listing.userRef])
  const onchangeHandler=(e)=>{
    setMessage(e.target.value)
  }
  return (
    <>
      {
        landlord && (
          <div className='flex flex-col gap-2'>
            <p>Contact: <span className='font-semibold'>{landlord.userName}</span> for <span className='font-semibold'>
              {listing.name.toLowerCase()}
            </span></p>
            <textarea placeholder='enter your message here' className='w-full border p-3 rounded-lg ' name='message' id='message' rows='2'
            value={message} onChange={onchangeHandler}></textarea>
           <Link
  className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
  to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
>
  Send message
</Link>

          </div>
        )
      }
    </>
  )
}
