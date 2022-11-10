import { useState } from 'react';
import './eos.js'

export default function Wallet() {
  const [keys, setKeys] = useState()

  const generateKeyPair = async () => {
    const privateKey = await eosjs_ecc.randomKey()
    const publicKey = await eosjs_ecc.privateToPublic(privateKey)
    setKeys({ privateKey, publicKey })
  }

  return (
    <div className='max-w-5xl mx-auto p-5'>
      <h1 className='text-4xl md:text-5xl font-black text-center mt-10'>EOS Keypair</h1>
      <p className='text-xs mb-2 text-center mt-2'>Generate EOS private & public keys</p>

      <div className='p-5 max-w-4xl mx-auto mt-12 bg-[#121212] rounded-xl'>
        <button onClick={() => generateKeyPair()} className="p-2 bg-blue-500 text-black rounded-xl font-bold w-full check-btn">Generate new keys</button>
      </div>

      <div>
        {keys && (
          <div className='p-5 max-w-4xl mx-auto mt-6 bg-[#121212] rounded-xl'>
            <div className='flex flex-col gap-5'>
              <p className='text-xl font-bold'>EOS Keypairs</p>
              <div className='flex gap-6 items-center text-red-500 bg-red-200 py-2 px-4 rounded-xl'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
                </svg>
                <p className='text-xs'>Please make sure you have saved your keys. Keys are not stored by us or the browser so there is no way to retrieve them at a later time.</p>
              </div>

              <div className='p-2 bg-black rounded-xl'>
                <p className='text-sm text-gray-400'>Private Key</p>
                <p className='break-words'>{keys.privateKey}</p>
              </div>
              <div className='p-2 bg-black rounded-xl'>
                <p className='text-sm text-gray-400'>Public Key</p>
                <p className='break-words'>{keys.publicKey}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
