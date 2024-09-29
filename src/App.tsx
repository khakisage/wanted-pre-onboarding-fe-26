import './App.css'
import { MOCK_DATA } from './mockdata/mockdata'
import { IMockData } from './interface/mockdata'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Card } from './components/Card'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const PER_PAGE = 10

const getMockData = (pageNum: number): Promise<{ datas: IMockData[]; isEnd: boolean }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const datas: IMockData[] = MOCK_DATA.slice(PER_PAGE * pageNum, PER_PAGE * (pageNum + 1))
      const isEnd = PER_PAGE * (pageNum + 1) >= MOCK_DATA.length

      resolve({ datas, isEnd })
    }, 1500)
  })
}

function App() {
  const [data, setData] = useState<IMockData[]>([])
  const [pageNum, setPageNum] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isEnd, setIsEnd] = useState<boolean>(false)
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadRef = useRef<HTMLDivElement | null>(null)

  const sumTotalPrice = (data: IMockData[]) => {
    return data.reduce((sum, item) => sum + item.price, 0)
  }

  const loadData = useCallback(() => {
    if (!isEnd && !isLoading) {
      setIsLoading(true)
      getMockData(pageNum).then(({ datas, isEnd }) => {
        setData((prevData) => {
          const newData = [...prevData, ...datas]
          setTotalPrice(sumTotalPrice(newData))
          return newData
        })
        setIsEnd(isEnd)
        setPageNum((prevPageNum) => prevPageNum + 1)
        setIsLoading(false)
      })
    }
  }, [pageNum, isEnd, isLoading])

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect()

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadData()
      }
    })

    if (loadRef.current) observerRef.current.observe(loadRef.current)

    return () => {
      if (observerRef.current) observerRef.current.disconnect()
    }
  }, [loadData])

  return (
    <>
      <div>
        <h1>total price: {totalPrice}</h1>
        <div className="mt-10">
          {data.map((items) => (
            <Card productId={items.productId} productName={items.productName} price={items.price} boughtDate={items.boughtDate} />
          ))}
          {isLoading && (
            <div>
              <SkeletonTheme baseColor="#585858" height={50}>
                <Skeleton count={PER_PAGE} />
              </SkeletonTheme>
            </div>
          )}
          <div ref={loadRef} />
        </div>
        {isEnd && <div>더 이상 데이터가 없습니다.</div>}
      </div>
    </>
  )
}

export default App
