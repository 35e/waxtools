import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'

function App() {
  const [offerId, setOfferId] = useState('')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const priceLink = 'https://wax.api.atomicassets.io/atomicmarket/v2/sales?limit=1&order=asc&sort=price&state=1&template_id='
  const ipfsLink = 'https://ipfs.hivebp.io/ipfs/'

  const getOffer = async (offerId) => {
    setLoading(true)
    const { data: res } = (await axios('https://wax.api.atomicassets.io/atomicassets/v1/offers/' + offerId)).data

    const sender = {
      wallet: res.sender_name,
      assets: res.sender_assets.map(asset => {
        return {
          asset: asset.asset_id,
          template: asset.template.template_id,
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
          asset: asset.asset_id,
          template: asset.template.template_id,
          price: asset.backed_tokens[0]?.amount / 100000000,
          ipfs: asset.data.img ? ipfsLink + asset.data.img : ipfsLink + asset.data.video,
          type: asset.data.img ? 'image' : 'video'
        }
      })
    }

    // Loop through all assets
    const allAssets = sender.assets.concat(receiver.assets)

    for (const asset of allAssets) {
      const data = (await (await fetch(priceLink + asset.template)).json()).data[0]
      if (data && ((data.listing_price / 100000000) > asset.price || isNaN(asset.price))) {
        asset.price = data.listing_price / 100000000
      }
    }

    // Loop through all assets and calculate total price
    sender.total = sender.assets.reduce((a, b) => a + b.price, 0)
    receiver.total = receiver.assets.reduce((a, b) => a + b.price, 0)

    setData([sender, receiver])
    setLoading(false)
  }

  return (
    <>
      <h1 className='text-3xl'>Atomic Trade checker</h1>
      <p className='text-xs mb-2'>WEBSITE STYLING COMING SOON, enjoy this ugly functioning website for now</p>
      <input type="text" onChange={(e) => setOfferId(e.target.value)} className="border border-green-500" placeholder='TRADE ID' />
      <button onClick={() => getOffer(offerId)} className="px-2 ml-2 bg-green-500">Check</button>

      <p className='mt-5'>How to get trade id? Go to the trade page and look in the URL</p>
      <img src="./trade_id.png" alt="a good tutorial" className='mx-auto' />

      <div className='mt-20'>
        {data && (
          <div className='flex gap-8 justify-center'>
            {data.map((user, i) => (
              <div key={i}>
                <h2 className='text-2xl'>{user.wallet}</h2>
                <p className='text-xl'>Total value: {(user.total).toFixed(2)} WAX</p>
                <div className='flex flex-col gap-3'>
                  {user.assets.map((asset, index) => (
                    <div className='flex items-center gap-2 bg-[#434C5E] text-[#ECEFF4] rounded-md overflow-hidden'>
                      {asset.type === 'image' ? (
                        <>
                          <img src={asset.ipfs} alt="asset" key={index} className='w-16 h-16 p-2 object-cover' />
                        </>
                      ) : (
                        <video src={asset.ipfs} key={index} className='w-16 h-16 p-2' autoPlay muted />
                      )}
                      <p>{(asset.price).toFixed(2)} WAX</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default App
