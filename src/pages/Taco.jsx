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

  const [pageCount, setPageCount] = useState(0)
  const logWorkLink = `https://wax.eosphere.io/v2/history/get_actions?account=${wallet}&limit=${limit}&sort=desc&filter=*:logwork&skip=${skip}`
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
    setPageCount(data.total.value / 100)
    setTransactions(data.actions)
  }

  const getData = async () => {
    await getVenues()
    await getLogWork()
  }

  const handlePageClick = async (data) => {
    const skip = data.selected * 100
    await getLogWork(skip)
    console.log(skip)
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
            <h2 className='mt-6 text-2xl font-bold'>Logwork</h2>
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
                  {transactions.map((action, index) => (
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
            <ReactPaginate
              previousLabel={'<<'}
              pageCount={pageCount}
              nextLabel={'>>'}
              marginPagesDisplayed={1}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              renderOnZeroPageCount={null}
              containerClassName={'flex justify-center mt-4'}
              pageLinkClassName={'p-2 text-white'}
              activeClassName={'bg-blue-500 font-bold rounded-full'}
              previousClassName={'mr-2'}
              nextClassName={'ml-2'}
            />
          </div>
        )}
      </div>
    </div >
  )
}
