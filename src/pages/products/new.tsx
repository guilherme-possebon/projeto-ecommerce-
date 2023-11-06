import Layout from '@/Components/Layout'
import ProductForm from '@/Components/ProductForm'
import React from 'react'

export default function NewProduct() {
  return (
    <Layout>
      <h1 className="dark:textDarkMode">Novo produto</h1>
      <ProductForm />
    </Layout>
  )
}
