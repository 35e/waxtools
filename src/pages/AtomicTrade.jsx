import { useState } from 'react'
import axios from 'axios'

import Collapsible from '../../components/Collapsible'

function AtomicTrade() {
  const [offerId, setOfferId] = useState('')
  const [data, setData] = useState()
  const [loading, setLoading] = useState(false)

  const atomicNodes = [
    'wax.api.atomicassets.io',
    'api.wax-aa.bountyblok.io',
    'atomic.tokengamer.io',
    'wax-aa.eu.eosamsterdam.net',
    'api.atomic.greeneosio.com',
    'atomic.wax.eosrio.io'
  ]

  const [node, setNode] = useState(atomicNodes[0])

  const priceLink = `https://${node}/atomicmarket/v2/sales?limit=1&order=asc&sort=price&state=1&template_id=`
  const ipfsLink = 'https://ipfs.hivebp.io/ipfs/'

  const getOffer = async (offerId) => {
    setLoading(true)
    const { data: res } = (await axios(`https://${node}/atomicassets/v1/offers/` + offerId)).data

    const sender = {
      wallet: res.sender_name,
      assets: res.sender_assets
    }

    const receiver = {
      wallet: res.recipient_name,
      assets: res.recipient_assets
    }

    setData({ offer_id: res.offer_id, parties: [sender, receiver] })
    setLoading(false)
  }

  return (
    <div className='content'>
      <h1 className='text-2xl md:text-5xl font-black text-center mt-10'>Atomic Trade Checker</h1>
      <p className='text-xs mb-2 text-center'>Quickly check the amount of backed tokens in a trade.</p>

      <div className='p-5 max-w-4xl mx-auto mt-12 bg-[#121212] rounded-xl'>
        <div className='grid grid-cols-1 md:grid-cols-3'>
          <input type="text" onChange={(e) => setOfferId(e.target.value)} className="bg-black md:col-span-2 p-2 rounded-t-xl rounded-b-none md:rounded-l-xl md:rounded-r-none" placeholder='Trade ID' />
          <button onClick={() => getOffer(offerId)} className="p-2 bg-blue-500 text-black rounded-t-none rounded-b-xl md:rounded-r-xl md:rounded-l-none font-bold check-btn">Check trade</button>
        </div>

        <div className='mt-6 flex flex-col gap-3'>
          <Collapsible label="How do I get the trade id?">
            <p>Go to the page of the trade and you will see the ID in the left upper corner</p>
            <img src="./trade_tut.png" alt="a good tutorial" />
          </Collapsible>

          <Collapsible label="Why is my trade not showing up?">
            <p>The website is still in early development. So there might be some errors.</p>
          </Collapsible>
        </div>
      </div>

      {data && (
        <div className='max-w-4xl mx-auto mt-6 bg-[#121212] rounded-xl overflow-hidden'>
          <div className='px-5 py-4 bg-[#0e0e0e]'>
            <h2 className='font-bold text-xl'>Trade <a href={`https://wax.atomichub.io/trading/trade-offer/${data.offer_id}`} target="_blank">#{data.offer_id}</a></h2>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-5'>
            {data.parties.map((user, i) => (
              <div key={i} className="w-full">
                <p>Wallet: <a href={`https://wax.atomichub.io/profile/${user.wallet}`} target="_blank">{user.wallet}</a></p>
                {/* <p>Total value: {(user.total).toFixed(2)} WAX</p> */}
                <div className='flex flex-col gap-2 mt-4'>
                  {user.assets.length > 0 ? user.assets.map((asset, index) => (
                    <a key={index} href={`https://wax.atomichub.io/explorer/asset/${asset.asset_id}`} target="_blank" className='bg-black text-white hover:bg-gray-900 rounded-md transition-color duration-100 ease-in-out'>
                      <div className='flex items-center gap-2 overflow-hidden text-sm'>
                        {asset.data.img ? (
                          <>
                            <img src={ipfsLink + asset.data.img} alt="asset" key={index} className='w-16 h-16 p-2 object-cover' />
                          </>
                        ) : (
                          <video src={ipfsLink + asset.data.video} key={index} className='w-16 h-16 p-2' autoPlay muted loop />
                        )}
                        <div>
                          <div className='flex gap-2'>
                            <p>[{asset.collection.collection_name}]</p>
                            {asset.backed_tokens.map((token, index) => (
                              <p key={index} className='bg-blue-500 inline-block py-[2px] px-[4px] rounded-md text-xs'>{(token.amount / 100000000)} {token.token_symbol}</p>
                            ))}
                          </div>
                          <p>{asset.name}</p>
                        </div>
                      </div>
                    </a>
                  )) : (<div className='w-full bg-black h-[64px] text-gray-400 rounded-md grid place-items-center'>No assets</div>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <footer className='text-center mt-5 text-sm'>
        <p className='flex justify-center items-center'>Made with<img className='w-[20px] h-[20px] mx-1' src='/svg/heart.svg' />by Spezi#2220</p>
      </footer>
    </div>
  );
}

export default AtomicTrade
