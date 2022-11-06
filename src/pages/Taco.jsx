import { useState } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import ReactPaginate from 'react-paginate'

dayjs.extend(utc)
dayjs.extend(timezone)

export default function Taco() {
  const [wallet, setWallet] = useState('')
  const [venues, setVenues] = useState([])
  const [transactions, setTransactions] = useState([])

  // Filter
  const [skip, setSkip] = useState(0)
  const [limit, setLimit] = useState(100)
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'))

  const [filterWallet, setFilterWallet] = useState('')

  const logWorkLink = `https://wax.eosphere.io/v2/history/get_actions?account=${wallet}&limit=${limit}&sort=desc&filter=*:logwork&skip=`
  const venuesLink = `https://wax.greymass.com/v1/chain/get_table_rows`

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

    setVenues(await data.filter((venue) => venue.level >= 100))
  }

  const getLogWork = async (skip = 0) => {
    const response = await fetch(logWorkLink + skip)
    const data = (await response.json())
    setSkip(skip + limit)
    return data.actions
  }

  const getData = async () => {
    setSkip(0)
    await getVenues()
    const trx = await getLogWork()
    setTransactions(trx)
  }

  const loadMore = async () => {
    const trx = await getLogWork(skip)
    setTransactions([...transactions, ...trx])
  }

  return (
    <div className='max-w-5xl mx-auto p-5'>
      <h1 className='text-4xl md:text-5xl font-black text-center mt-10'>Taco Logwork</h1>
      <p className='text-xs mb-2 text-center mr-20'>Check logworks...</p>

      <div className='p-5 max-w-4xl mx-auto mt-12 bg-[#121212] rounded-xl'>
        <div className='grid grid-cols-1 md:grid-cols-3'>
          <input type="text" onChange={(e) => setWallet(e.target.value)} className="bg-black md:col-span-2 p-2 rounded-t-xl rounded-b-none md:rounded-l-xl md:rounded-r-none" placeholder='Venue owner wallet' />
          <button onClick={() => getData()} className="p-2 bg-blue-500 text-black rounded-t-none rounded-b-xl md:rounded-r-xl md:rounded-l-none font-bold check-btn">Check</button>
        </div>
        {venues.length > 0 && (
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

        {transactions.length > 0 && (
          <div className="flex flex-col">
            <div className='flex mt-6 items-center justify-between'>
              <h2 className='text-2xl font-bold'>Logwork</h2>
              <div>
                <input className='bg-black rounded-md p-2' type="text" placeholder='Wallet filter' onChange={(e) => setFilterWallet(e.target.value)} />
              </div>
            </div>
            <div className="mt-3 overflow-auto shadow md:rounded-lg max-h-[500px]">
              <table className="w-full">
                <thead className="bg-black text-white sticky top-0">
                  <tr className=''>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-6">Wallet</th>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-6">Action</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold">Trx</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-[#0a0a0a]">
                  {transactions.filter((action) => action.act.data.user.includes(filterWallet)).map((action, index) => (
                    <tr key={index}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-6">{action.act.data.user}</td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs font-medium sm:pl-6">
                        <span className='bg-blue-500 py-[2px] px-[4px] rounded-md text-xs'>{action.act.account}</span> <span className='bg-blue-500 py-[2px] px-[4px] rounded-md text-xs'>{action.act.name}</span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <a className='flex gap-2' href={`https://waxblock.io/transaction/${action.trx_id}`} target="_blank"><img src='/svg/link.svg' width={15} height={15} />{action.trx_id.slice(0, 8)}</a>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">{dayjs(action.timestamp).tz(dayjs.tz.guess()).format('DD MMM \'YY, HH:mm:ss')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className='text-center mt-2'>
              <div className='bg-blue-500 p-2 inline-block rounded-md cursor-pointer hover:bg-blue-600 transition-colors' onClick={() => loadMore()}>Load more</div>
            </div>
          </div>
        )}
      </div>
    </div >
  )
}
