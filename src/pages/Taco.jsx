import { useState } from 'react'
import dayjs from 'dayjs'

export default function Taco() {
  const [wallet, setWallet] = useState('')
  const logWorkLink = `https://wax.eosphere.io/v2/history/get_actions?account=${wallet}&limit=100&sort=desc&skip=0&filter=*:logwork`
  const venuesLink = `https://wax.greymass.com/v1/chain/get_table_rows`

  const [venues, setVenues] = useState()
  const [transactions, setTransactions] = useState()

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

    for (const venue of data) {
      const image = await fetch('https://wax.api.atomicassets.io/atomicmarket/v1/assets/' + venue.asset_id)
      venue.img = 'https://ipfs.hivebp.io/ipfs/' + (await image.json()).data.mutable_data.img
    };

    console.log(data)

    setVenues(await data.filter((venue) => venue.level >= 100))
  }

  const getLogWork = async () => {
    const response = await fetch(logWorkLink)
    const data = (await response.json()).actions
    console.log(data)

    setTransactions(data)
  }

  const getData = async () => {
    await getVenues()
    await getLogWork()
  }

  return (
    <div className='max-w-5xl mx-auto p-5'>
      <h1 className='text-4xl md:text-5xl font-black text-center mt-10'>Taco Logwork</h1>
      <p className='text-xs mb-2 text-center mr-20'>Check logworks...</p>

      <div className='p-5 max-w-4xl mx-auto mt-12 bg-[#121212] rounded-xl'>
        <div className='grid grid-cols-1 md:grid-cols-3'>
          <input type="text" onChange={(e) => setWallet(e.target.value)} className="bg-black md:col-span-2 p-2 rounded-t-xl rounded-b-none md:rounded-l-xl md:rounded-r-none" placeholder='Wallet' />
          <button onClick={() => getData()} className="p-2 bg-blue-500 text-black rounded-t-none rounded-b-xl md:rounded-r-xl md:rounded-l-none font-bold check-btn">Check</button>
        </div>

        {venues && (
          <div className='mt-8'>
            {venues.length > 0 && (
              <>
                <h2 className='text-2xl font-bold'>Venues</h2>
                {venues.map((venue, index) => (
                  <div className='mt-2 flex items-center gap-4' key={index} >
                    <img src={venue.img} alt="venue" width={75} height={75} />
                    <div>
                      <p>Name: {venue.custom_name}</p>
                      <p>Level: {venue.level}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {transactions && (
          <div class="flex flex-col">
            <h2 className='mt-6 text-2xl font-bold'>Logwork</h2>
            <div class="overflow-x-auto mt-4">
              <div class="inline-block min-w-full align-middle">
                <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table class="min-w-full">
                    <thead class="bg-black text-white">
                      <tr>
                        <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-6">Wallet</th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold">Trx</th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody class="bg-[#0a0a0a]">
                      {transactions.map((action, index) => (
                        <tr key={index}>
                          <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-6">{action.act.data.user}</td>
                          <td class="whitespace-nowrap px-3 py-4 text-sm"><a href={`https://waxblock.io/transaction/${action.trx_id}`}>Link to waxblock</a></td>
                          <td class="whitespace-nowrap px-3 py-4 text-sm">{dayjs(action.timestamp).format('DD MMM - HH:mm')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div >
  )
}
