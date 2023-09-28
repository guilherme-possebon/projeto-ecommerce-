import { createContext, useContext, useState, ReactNode } from 'react'

interface ProductContextType {
  productDeleted: boolean
  setProductDeleted: (Deleted: boolean) => void
}

const ProductContextDelete = createContext<ProductContextType | undefined>(
  undefined
)

export function useProductContextDeleted(): ProductContextType {
  const context = useContext(ProductContextDelete)
  if (!context) {
    throw new Error(
      'useProductContextDeleted must be used within a ProductProvider'
    )
  }
  return context
}

interface ProductProviderProps {
  children: ReactNode
}

export function ProductProviderDeleted({
  children
}: ProductProviderProps): JSX.Element {
  const [productDeleted, setProductDeleted] = useState<boolean>(false)

  return (
    <ProductContextDelete.Provider
      value={{ productDeleted, setProductDeleted }}
    >
      {children}
    </ProductContextDelete.Provider>
  )
}
