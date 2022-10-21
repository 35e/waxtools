import { useState } from 'react'
import axios from 'axios'

export default function Taco() {
  const [wallet, setWallet] = useState('')
  const link = `https://wax.eosrio.io/v2/history/get_actions?account=${wallet}&filter=*%3Alogwork&skip=0&limit=100&sort=desc`
  const [data, setData] = useState()

  const getActions = async () => {
    const { data: data } = await axios(link);
    console.log(data)
    setData(data);
  }

  return (
    <div className='max-w-5xl mx-auto p-5'>
      <h1 className='text-4xl md:text-5xl font-black text-center mt-10'>Taco Logwork</h1>
      <p className='text-xs mb-2 text-center mr-20'>Check logworks...</p>

      <div className='p-5 max-w-4xl mx-auto mt-12 bg-[#121212] rounded-xl'>
        <div className='grid grid-cols-1 md:grid-cols-3'>
          <input type="text" onChange={(e) => setWallet(e.target.value)} className="bg-black md:col-span-2 p-2 rounded-t-xl rounded-b-none md:rounded-l-xl md:rounded-r-none" placeholder='Wallet' />
          <button onClick={() => getActions()} className="p-2 bg-blue-500 text-black rounded-t-none rounded-b-xl md:rounded-r-xl md:rounded-l-none font-bold check-btn">Check</button>
        </div>

        <div className='mt-12'>
          { data && data.actions.map((action, index) => (
            <div key={index}>
              <p>{ action.act.data.user } | <a href={`https://wax.bloks.io/transaction/${action.trx_id}`} target="_blank">trx</a></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
