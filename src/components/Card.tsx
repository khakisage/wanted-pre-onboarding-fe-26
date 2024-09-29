import { IMockData } from '../interface/mockdata'

export const Card = (CardProps: IMockData) => {
  const { productId, productName, price, boughtDate } = CardProps
  return (
    <div key={productId} className="flex flex-col border-2 gap-2 mb-3">
      <h3>{productName}</h3>
      <p>{boughtDate}</p>
      <p>{price} 원</p>
    </div>
  )
}
