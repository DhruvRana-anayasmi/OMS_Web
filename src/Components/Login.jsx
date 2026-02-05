import axios from 'axios';
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { setAuthSession } from '../utils/Auth';
const Login = () => {
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(e.target[0].value);
        console.log(e.target[1].value);
        axios.post("http://localhost:8080/login",{
            username: e.target[0].value.trim(),
            password: e.target[1].value.trim()
        }).then((res)=>{
           
            setAuthSession(res.data);
            
            // Trigger auth state update
            window.dispatchEvent(new Event('authChange'));
            
            navigate('/');
        }).catch((error) => {
            alert("Login Failed");
            console.error("There was an error!", error);
        });
    }
  return (
    <div>
        <div className='header text-3xl font-bold'>
            Login
        </div>
      <form onSubmit={handleSubmit}>    
        <input type="text" className='p-1 rounded-md border w-100' placeholder='Username' />
        <input type="password" className='p-1 rounded-md border w-100' placeholder='Password' />
        <div className='flex gap-2'>
        <button type="submit" className='rounded-md px-4 py-1 bg-blue-500 text-white'>Submit</button>
        <button type="reset" className='rounded-md px-4 py-1 bg-gray-500 text-white'>Reset</button>
        </div>
      </form>
    </div>
  )
}

export default Login;