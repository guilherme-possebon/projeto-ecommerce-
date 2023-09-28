import { createContext, useContext, useState, ReactNode } from 'react'

interface ProductContextType {
  productSaved?: boolean
  setProductSaved: (saved: boolean) => void
  productDeleted?: boolean
  setProductDeleted: (Deleted: boolean) => void
}
{
  /* -----------------------------------------------Save----------------------------------------------- */
}
const ProductContext = createContext<ProductContextType | undefined>(undefined)

export function useProductContext(): ProductContextType {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider')
  }
  return context
}

interface ProductProviderProps {
  children: ReactNode
}

export function ProductProvider({
  children
}: ProductProviderProps): JSX.Element {
  const [productSaved, setProductSaved] = useState<boolean>(false)
  const [productDeleted, setProductDeleted] = useState<boolean>(false)

  return (
    <ProductContext.Provider
      value={{
        productSaved,
        setProductSaved,
        productDeleted,
        setProductDeleted
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}
