import React from 'react'

const Logout = () => {
    const handleLogout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('tokenExpiry');
        
        // Trigger auth state update
        window.dispatchEvent(new Event('authChange'));
        
        window.location.reload();
    }
  return (
    <div className='flex flex-col gap-4 justify-center items-center h-screen mt-[-10vh]'>
    <div className='flex text-2xl justify-center items-center font-semibold'>Are you sure you want to logout?</div>
    <div className='p-1 gap-3 flex'>
        <button className='bg-gray-500 p-1 rounded'>Cancel</button>
        <button className='bg-red-600 p-1 rounded text-white' onClick={handleLogout}>Logout</button>
    </div>
    </div>
)
}

export default Logout