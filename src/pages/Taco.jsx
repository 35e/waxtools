import { useState } from 'react'
import axios from 'axios'

export default function Taco() {
  const [wallet, setWallet] = useState('')
  const logWorkLink = `https://api.waxsweden.org/v2/history/get_actions?account=${wallet}&filter=*%3Alogwork&skip=0&limit=100&sort=desc`
  const venuesLink = `https://wax.greymass.com/v1/chain/get_table_rows`

  const [venues, setVenues] = useState([])
  const [data, setData] = useState()

  const getVenues = async () => {
    const response = await fetch(venuesLink, {
      method: 'POST',
      body: JSON.stringify({
        "json": true,
        "code": "g.taco",
        "scope": "g.taco",
        "table": "venues",
        "lower_bound": wallet,
        "upper_bound": wallet,
        "index_position": 2,
        "key_type": "i64",
        "limit": 1000,
        "reverse": false,
        "show_payer": false
      })
    })

    let data = (await response.json()).rows.filter((venue) => venue.level >= 100)
    // console.log(data)

    // data.forEach(async (venue) => {
    for (let i = 0; i < data.length; i++) {
      // console.log(venue)
      const image = await fetch('https://wax.api.atomicassets.io/atomicmarket/v1/assets/' + data[i].asset_id)
      data[i].img = 'https://ipfs.hivebp.io/ipfs/' + (await image.json()).data.mutable_data.img
    };

    setVenues(await data.filter((venue) => venue.level >= 100))
  }

  // const getActions = async () => {
  //   const { data: data } = await fetch(link);
  //   console.log(data)
  //   setData(data);
  // }

  return (
    <div className='max-w-5xl mx-auto p-5'>
      <h1 className='text-4xl md:text-5xl font-black text-center mt-10'>Taco Logwork</h1>
      <p className='text-xs mb-2 text-center mr-20'>Check logworks...</p>

      <div className='p-5 max-w-4xl mx-auto mt-12 bg-[#121212] rounded-xl'>
        <div className='grid grid-cols-1 md:grid-cols-3'>
          <input type="text" onChange={(e) => setWallet(e.target.value)} className="bg-black md:col-span-2 p-2 rounded-t-xl rounded-b-none md:rounded-l-xl md:rounded-r-none" placeholder='Wallet' />
          <button onClick={() => getVenues()} className="p-2 bg-blue-500 text-black rounded-t-none rounded-b-xl md:rounded-r-xl md:rounded-l-none font-bold check-btn">Check</button>
        </div>

        <div className='mt-12'>
          {venues.length > 0 && (
            <>
              <h2 className='text-2xl font-bold'>Venues</h2>
              {venues.map((venue, index) => (
                <div className='mt-5' key={index} >
                  <p>{venue.custom_name}</p>
                  <img src={venue.img} alt="venue" width={150} height={150} />
                </div>
              ))}
            </>
          )}
          {data && data.actions.map((action, index) => (
            <div key={index}>
              <p>{action.act.data.user} | <a href={`https://waxblock.io/transaction/${action.trx_id}`} target="_blank">trx</a></p>
            </div>
          ))}
        </div>
      </div>
    </div >
  )
}
