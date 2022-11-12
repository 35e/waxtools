import { useEffect, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import dayjs from 'dayjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export default function Price() {
  const [data, setData] = useState()
  const [price, setPrice] = useState()

  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/coins/wax/market_chart?vs_currency=usd&days=7&interval=daily')
      .then((res) => res.json())
      .then((data) => {
        let res = {}
        res.timestamp = Array.from(data.prices, (data) => dayjs(data[0]).format('DD MMM'))
        res.price = Array.from(data.prices, (data) => data[1])
        setData(res)
      })

    const getPrice = () => {
      fetch('https://api.coingecko.com/api/v3/simple/price?ids=wax&vs_currencies=usd')
        .then((res) => res.json())
        .then((data) => {
          setPrice(data.wax.usd)
        })
    }

    const interval = setInterval(getPrice, 60e3)
    getPrice()

    return () => clearInterval(interval);
  }, [])

  return (
    <div className='max-w-5xl mx-auto p-5'>
      <h1 className='text-4xl md:text-5xl font-black text-center mt-10'>WAX Price</h1>
      <p className='text-xs mb-2 text-center mt-2'>See the actual price of WAX</p>

      <div className='p-5 max-w-4xl mx-auto mt-12 bg-[#121212] rounded-xl'>
        {price && (
          <p>Current price: ${price}</p>
        )}

        {data && (
          <Line
            data={{
              labels: data.timestamp,
              datasets: [
                {
                  fill: true,
                  label: 'Price (USD)',
                  data: data.price,
                  borderColor: 'rgb(53, 162, 235)',
                  backgroundColor: 'rgba(53, 162, 235, 0.5)'
                }
              ]
            }}
          />
        )}
      </div>
    </div>
  )
}
