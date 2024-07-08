/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { Link } from 'react-router-dom'
import axios from 'axios';
import { updateUserFailure,updateUserSuccess,updateUserStart, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserStart, signOutUserFailure, signOutUserSuccess } from '../redux/user/userSlice';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
export default function Profile() {
  const dispatch=useDispatch();
  const fileRef = useRef(null);
  const { currentUser,loading,error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [showListingError,setShowListingError]=useState(false)
  console.log(formData);
  const [userListings,setUserListings]=useState([])

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };
  const handleChange=(e)=>{
    setFormData({...formData,[e.target.id]:e.target.value})
  }
  const handleSubmit=async(e)=>{
    e.preventDefault();
    try {
      dispatch(updateUserStart());
     const updateResult= await axios.post(`/api/user/update/${currentUser._id}`,formData);
     console.log(updateResult.data);
     toast.success("updated succesfully");
     dispatch(updateUserSuccess(updateResult.data));

    } catch (error) {
      console.log("this is error",error.response.data.message);
      toast.error(error.response.data.message);
      
      dispatch(updateUserFailure(error.response.data.message));
    }
  }
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  const handleSignOut=async()=>{
    try {
     dispatch( signOutUserStart())
      const response=await fetch(`api/auth/signout`);
      const data=await response.json()
      if(data.success===false){
         dispatch(signOutUserFailure(data.message));
        return ;
      }
      dispatch(signOutUserSuccess());
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }

  }
  const handleShowListing=async()=>{
    try {
      setShowListingError(false);
      const res=await fetch(`/api/user/listings/${currentUser._id}`)
       const data=await res.json();
       if(data.success===false){
        setShowListingError(true);
       }
       setUserListings(data);
    } catch (error) {
      setShowListingError(true);
    }
  }
  const handleListingDelete=async(listingId)=>{
    try {
      const res=await fetch(`/api/listing/delete/${listingId}`,{
       method:'DELETE',
      })
      const data=await res.json();
      if(data.success===false){
        console.log(data.message);
        return;
      }
      setUserListings((prev)=>prev.filter((listing)=>listing._id!==listingId));
    } catch (error) {
      console.log(error.message);
    }
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <Toaster
  position="bottom-left"
  reverseOrder={true}
/>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData?.avatar || currentUser.avatar}
          alt='profile'
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
        />
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
        <input
        onChange={handleChange}
          type='text'
          placeholder='username'
          defaultValue={currentUser.userName}
          id='userName'
          className='border p-3 rounded-lg'
        />
        <input
          type='email'
          placeholder='email'
          defaultValue={currentUser.email}
          id='email'
          onChange={handleChange}
          className='border p-3 rounded-lg'
        />
        <input
        onChange={handleChange}
          type='text'
          placeholder='password'
          id='password'
          className='border p-3 rounded-lg'
        />
        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>
       {loading?'loading....':'Update'}
        </button>
        <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' to='/create-listing'>
         Create Listing
        </Link>
        
       
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete account</span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
      <button onClick={handleShowListing} className='text-green-700 w-full'>show Listings</button>
    <p className='text-red-700 mt-5'>{showListingError?'error showing listing':""}</p>
    <h1 className='text-center mb-2 text-2xl font-semibold'>Your listings</h1>
    <div>
      
   {userListings && userListings.length>0 && 
   
   userListings.map((listing,index)=>(
    <div key={listing._id} className='border  rounded-lg p-3 flex justify-between items-center gap-4'>
    
     <Link to={`/listing/${listing._id}`}>
      <img src={listing.imageUrls[0]} alt='coverImage' className='h-16 w-16 object-contain '/>

     </Link>
     <Link to={`/listing/${listing._id}`} className='font-semibold flex-1 hover:underline truncate' >
      <p >{listing.name}</p>
     </Link>
     <div className=" flex flex-col">
      <button onClick={()=>handleListingDelete(listing._id)} className='text-red-700 uppercase'>delete</button>
      <Link to={`/update-listing/${listing._id}`}>
      <button className='text-green-700 uppercase'>Edit</button>
      </Link>
      
     </div>
    </div>
   ))
   }
    </div>
    </div>
  );
}