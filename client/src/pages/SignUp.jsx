/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast';
import { OAuth } from '../components/OAuth';



const SignUp = () => {
    const [formdata,setFormData]=useState({});
    const [error,setError]=useState(null);
    const [loading,setLoading]=useState(false);
    const navigate=useNavigate();

    const submitHandler=async(e)=>{
        e.preventDefault();
        if(!formdata.userName || !formdata.password || !formdata.email){
          toast.error("All fields are required");
          return ;
        }
       try {
          setLoading(true);
       const response=  await axios.post('/api/auth/signup',formdata);
       
       console.log(response.data.message);
       toast.success("User Created Successfully");
       toast.success("Redirecting to Login");
       setTimeout(() => {
        setLoading(false)
      }, 2000);
       setTimeout(() => {
        navigate('/sign-in');
      }, 2000);
      
        
          
      
       
       } catch (error) {
         if(error.response.data.success===false){
            setLoading(false);
            console.log(error.response.data);
            toast.error("username or email exists")
         }
       }
    }
    const changeHandler=(e)=>{
        setFormData({
            ...formdata,
            [e.target.id]:e.target.value,
        })
    }
    console.log(formdata);
  return (

   
    <div className='max-w-lg mx-auto'>
  
        <h1 className='text-center text-3xl font-semibold my-7'>Sign Up</h1>
        <Toaster
  position="bottom-left"
  reverseOrder={true}
/>
        <form onSubmit={submitHandler} className='flex flex-col gap-4'>
            <input type='text' placeholder='username'
            className='border required p-3 rounded-lg' id='userName' onChange={changeHandler}/>
             <input type='email' placeholder='email'
            className='border p-3 required rounded-lg' id='email' onChange={changeHandler} />
             <input type='password' placeholder='password'
            className='border required p-3 rounded-lg' id='password' onChange={changeHandler}/>
            <button disabled={loading} className='bg-slate-700 disabled:opacity-80 text-white uppercase hover:opacity-95 rounded-lg p-3'>
                {loading?"Loading....":"sign up"}
            </button>
            <OAuth/>
        </form>
        <div className='flex gap-2 mt-5'>
            <p>Have an Account?</p>
            <Link to='/sign-in' className=''>
                <span className='text-blue-700'>Sign-in</span>
            </Link>
        </div>
    </div>
  )
}

export default SignUp