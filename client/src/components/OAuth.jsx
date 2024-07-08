/* eslint-disable no-unused-vars */
import React from 'react'
import {GoogleAuthProvider,getAuth, signInWithPopup} from 'firebase/auth';
import { app } from '../firebase';
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { Link,useNavigate } from 'react-router-dom'

export const OAuth = () => {
    const dispatch=useDispatch()
    const navigate=useNavigate();
    const handleGoogleClick=async()=>{
     try {
        const provider=new GoogleAuthProvider()
        const auth=getAuth(app)
        const result=await signInWithPopup(auth,provider)
        console.log(result);
        
            const obj={
                name:result.user.displayName,
                email:result.user.email,
                photo:result.user.photoURL
            }
            const response=await axios.post('/api/auth/google',obj)
            console.log(response);
            dispatch(signInSuccess(response.data));
            navigate('/');

        
     } catch (error) {
        console.log("not sign in google",error);
     }
    }
    
  return (
    <button type='button' onClick={handleGoogleClick} className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-80'>Continue with google</button>
  )
}
//when change to button it's not gonna submit the form 
//as automatically is't type of submit
