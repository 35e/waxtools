import React from 'react'
import { Link } from 'react-router-dom'


export default function Home() {
  return (
    <div className='max-w-5xl mx-auto p-5'>
      <h1 className='text-4xl md:text-5xl font-black text-center mt-10'>WaxTools</h1>
      <p className='text-xs mb-2 text-center'>This website is still in development</p>

      <div className='grid grid-cols-1 md:grid-cols-2 mt-12 gap-6'>
        <Link to="atomic" className='bg-[#121212] rounded-md p-4 hover:bg-gray-900 transition-color duration-100 ease-in-out'>
          <div className='text-xl'>AtomicHub Trade Checker</div>
          <p className='text-gray-400 mt-2'>Trade safely. See the current values of the NFTs in a trade. And detect BACKED token scams.</p>
        </Link>

        <Link to="#" className='bg-[#080808] rounded-md p-4 transition-color duration-100 ease-in-out'>
          <div className='text-xl'>Taco Logwork</div>
          <p className='text-gray-400 mt-2'>W.I.P.</p>
        </Link>

        <div className='bg-[#080808] col-span-1 md:col-span-2 rounded-md p-4 grid place-items-center'>
          <div className='text-xl text-gray-500'>More coming soon...</div>
        </div>
      </div>

      <footer className='text-center mt-5 text-sm'>
        <p className='flex justify-center items-center'>Made with<img className='w-[20px] h-[20px] mx-1' src='/svg/heart.svg' />by Spezi#2220</p>
      </footer>
    </div>
  )
}
