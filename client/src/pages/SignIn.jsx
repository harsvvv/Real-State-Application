/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { signInstart,signInFailure,signInSuccess } from '../redux/user/userSlice';
import { OAuth } from '../components/OAuth';



const SignIn = () => {
    const [formdata,setFormData]=useState({});
    const {loading,error}=useSelector((state)=>state.user)
    const navigate=useNavigate();
    const dispatch=useDispatch()

    const submitHandler=async(e)=>{
        e.preventDefault();
        if(!formdata.email || !formdata.password){
          toast.error("All fields are Required");
          return;
        }
       try {
          dispatch(signInstart())
       const response=  await axios.post('/api/auth/signin',formdata);
       
       dispatch(signInSuccess(response.data));
       toast.success("User LoggedIN successfully");
       toast.success("Redirecting to Home");
       
       
       setTimeout(() => {
        navigate('/');
      }, 2000);
      
        
          
      
       
       } catch (error) {
         if(error.response.data.success===false){
            
            dispatch(signInFailure(error.response.data))
            
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
   
  return (

   
    <div className='max-w-lg mx-auto'>
  
        <h1 className='text-center text-3xl font-semibold my-7'>Sign In</h1>
        <Toaster
  position="bottom-left"
  reverseOrder={true}
/>
        <form onSubmit={submitHandler} className='flex flex-col gap-4'>
           
             <input type='email' placeholder='email'
            className='border p-3 rounded-lg' id='email' onChange={changeHandler} />
             <input type='password' placeholder='password'
            className='border p-3 rounded-lg' id='password' onChange={changeHandler}/>
            <button disabled={loading} className='bg-slate-700 disabled:opacity-80 text-white uppercase hover:opacity-95 rounded-lg p-3'>
                {loading?"Loading....":"sign in"}
            </button>
            <OAuth/>
        </form>
        <div className='flex gap-2 mt-5'>
            <p>dont Have an Account?</p>
            <Link to='/sign-up' className=''>
                <span className='text-blue-700'>Sign-up</span>
            </Link>
        </div>
    </div>
  )
}

export default SignIn