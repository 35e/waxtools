import React from 'react'
import { Link } from 'react-router-dom'


export default function Home() {
  return (
    <div className='max-w-5xl mx-auto p-5'>
      <h1 className='text-4xl md:text-5xl font-black text-center mt-10'>WaxTools</h1>
      <p className='text-xs mb-2 text-center'>This website is still in development</p>

      <div className='grid grid-cols-1 md:grid-cols-2 mt-12 gap-6'>
        <Link to="price" className='bg-[#121212] rounded-md p-4 hover:bg-gray-900 transition-color duration-100 ease-in-out'>
          <div className='text-xl'>WAX Price <span className='bg-orange-500 py-[2px] px-[4px] text-white font-bold rounded-md text-xs float-right'>W.I.P.</span></div>
          <p className='text-gray-400 mt-2'>See the actual price of WAX</p>
        </Link>

        <Link to="eos" className='bg-[#121212] rounded-md p-4 hover:bg-gray-900 transition-color duration-100 ease-in-out'>
          <div className='text-xl'>EOS Keypair</div>
          <p className='text-gray-400 mt-2'>Generate EOS private & public keys</p>
        </Link>

        <Link to="atomic" className='bg-[#121212] rounded-md p-4 hover:bg-gray-900 transition-color duration-100 ease-in-out'>
          <div className='text-xl'>AtomicHub Trade Checker</div>
          <p className='text-gray-400 mt-2'>Check the amount of backed tokens on NFTs in a trade.</p>
        </Link>

        <Link to="taco" className='bg-[#121212] rounded-md p-4 hover:bg-gray-900 transition-color duration-100 ease-in-out'>
          <div className='text-xl'>Taco Logwork <span className='bg-orange-500 py-[2px] px-[4px] text-white font-bold rounded-md text-xs float-right'>W.I.P.</span></div>
          <p className='text-gray-400 mt-2'>Check logworks of your venue.</p>
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
