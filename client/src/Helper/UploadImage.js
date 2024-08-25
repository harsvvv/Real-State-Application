const url=`https://api.cloudinary.com/v1_1/dviny76as/image/upload`
const uploadImage = async(image) => {
    const formData=new FormData()
    formData.append("file",image);
    formData.append("upload_preset","mern_product")
 const dataResponse=await fetch(url,{
    method:"post",
    body:formData
 })
  const response= dataResponse.json()
  console.log("this is the url"+response);
  return response;
}

export default uploadImage