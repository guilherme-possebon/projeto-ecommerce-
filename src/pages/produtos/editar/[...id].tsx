import Layout from '../../../Components/Layout'
import ProductForm from '../../..//Components/ProductForm'
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import type { ProductInterface } from '../../../../models/Product'

export default function EditProductPage() {
  const router = useRouter()
  const { id } = router.query
  const [productInfo, setProductInfo] = useState({})
  const idParam = Array.isArray(id) ? id.join(',') : id

  useEffect(() => {
    if (id === undefined) {
      return
    }
    axios
      .get(`/api/products?id=${idParam}`)
      .then((response: AxiosResponse<ProductInterface>) => {
        setProductInfo(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [id, idParam])

  return (
    <Layout>
      <h1>Editar produto</h1>
      {Object.keys(productInfo).length > 0 && <ProductForm {...productInfo} />}
    </Layout>
  )
}
