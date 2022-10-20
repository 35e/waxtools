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
      assets: res.sender_assets.map(asset => {
        return {
          asset_id: asset.asset_id,
          template_id: asset.template.template_id,
          name: asset.data.name,
          price: asset.backed_tokens[0]?.amount / 100000000,
          ipfs: asset.data.img ? ipfsLink + asset.data.img : ipfsLink + asset.data.video,
          type: asset.data.img ? 'image' : 'video'
        }
      })
    }

    const receiver = {
      wallet: res.recipient_name,
      assets: res.recipient_assets.map(asset => {
        return {
          asset_id: asset.asset_id,
          template_id: asset.template.template_id,
          name: asset.data.name,
          price: asset.backed_tokens[0]?.amount / 100000000,
          ipfs: asset.data.img ? ipfsLink + asset.data.img : ipfsLink + asset.data.video,
          type: asset.data.img ? 'image' : 'video'
        }
      })
    }

    // Loop through all assets
    const allAssets = sender.assets.concat(receiver.assets)

    for (const asset of allAssets) {
      const data = (await (await fetch(priceLink + asset.template_id)).json()).data[0]
      if (data && ((data.listing_price / 100000000) > asset.price || isNaN(asset.price))) {
        asset.price = data.listing_price / 100000000
      }
    }

    // Loop through all assets and calculate total price
    sender.total = sender.assets.reduce((a, b) => a + b.price, 0)
    receiver.total = receiver.assets.reduce((a, b) => a + b.price, 0)

    setData({ offer_id: res.offer_id, parties: [sender, receiver] })
    setLoading(false)
  }

  return (
    <div className='content'>
      <h1 className='text-2xl md:text-5xl font-black text-center mt-10'>Atomic Trade Checker</h1>
      <p className='text-xs mb-2 text-center'>The website is still in development, be sure to always double check a trade yourself!</p>

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
        <div className='p-5 max-w-4xl mx-auto mt-6 bg-[#121212] rounded-xl'>
          <h2 className='font-bold text-xl'>Trade <a href={`https://wax.atomichub.io/trading/trade-offers#tradeoffers-${data.offer_id}`} target="_blank">#{data.offer_id}</a></h2>
          {data && (
            <div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {data.parties.map((user, i) => (
                  <div key={i} className="w-full mt-4">
                    <p>Wallet: <a href={`https://wax.atomichub.io/profile/${user.wallet}`} target="_blank">{user.wallet}</a></p>
                    <p>Total value: {(user.total).toFixed(2)} WAX</p>
                    <div className='flex flex-col gap-2 mt-4'>
                      {user.assets.map((asset, index) => (
                        <a key={index} href={`https://wax.atomichub.io/explorer/asset/${asset.asset_id}`} target="_blank" className='bg-black text-white hover:bg-gray-900 rounded-md transition-color duration-100 ease-in-out'>
                          <div className='flex items-center gap-2 overflow-hidden text-sm'>
                            {asset.type === 'image' ? (
                              <>
                                <img src={asset.ipfs} alt="asset" key={index} className='w-16 h-16 p-2 object-cover' />
                              </>
                            ) : (
                              <video src={asset.ipfs} key={index} className='w-16 h-16 p-2' autoPlay muted loop />
                            )}
                            <div>
                              <p>{asset.name}</p>
                              <p>{(asset.price).toFixed(2)} WAX</p>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <footer className='text-center mt-5 text-sm'>
        <p className='flex justify-center items-center'>Made with<img className='w-[20px] h-[20px] mx-1' src='/svg/heart.svg' />by Spezi#2220</p>
      </footer>
    </div>
  );
}

export default AtomicTrade
