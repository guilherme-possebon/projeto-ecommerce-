import Layout from '@/Components/Layout'
import axios, { AxiosRequestConfig } from 'axios'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { CategoryInterface } from '../../models/Category'

export default function Categories() {
  const [name, setName] = useState('')
  const [parentCategory, setParentCategory] = useState('')
  const [categories, setCategories] = useState<CategoryInterface[]>([])
  const [editedCategory, setEditedCategory] =
    useState<CategoryInterface | null>(null)
  const [properties, setProperties] = useState<
    { name: string; values: string }[]
  >([])

  useEffect(() => {
    fetchCategories()
  }, [])

  function fetchCategories() {
    axios.get('/api/categories').then((result) => {
      setCategories(result.data)
    })
  }

  async function saveCategory(ev: { preventDefault: () => void }) {
    ev.preventDefault()

    if (name.length == 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Nome invalido'
      })
      return
    }

    const propertiesFiltered = properties.filter((obj) => {
      const values = Object.values(obj)
      return values.some((value) => value.trim() !== '')
    })

    let data = {
      name,
      parentCategory,
      properties: propertiesFiltered.map((p) => ({
        name: p.name,
        values: p.values.split(',')
      }))
    }

    if (editedCategory) {
      await axios.put('/api/categories', { ...data, _id: editedCategory._id })
      setEditedCategory(null)
    } else {
      await axios.post('/api/categories', data)
    }
    setName('')
    setParentCategory('')
    setProperties([])
    fetchCategories()
  }

  function editCategory(category: CategoryInterface) {
    setEditedCategory(category)
    setName(category.name)
    setParentCategory(category.parent?._id)
    setProperties(
      category.properties?.map(({ name, values }) => ({
        name,
        values: Array.isArray(values) ? values.join(',') : values
      }))
    )
  }

  function deleteCategory(category: CategoryInterface) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        cancelButton: 'button-danger',
        confirmButton: 'button-success'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons
      .fire({
        title: 'Você tem certeza?',
        text: `Você ira deletar a categoria ${category.name}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, deletar!',
        cancelButtonText: 'Não, cancelar!',
        reverseButtons: true
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { _id }: CategoryInterface = category
          await axios.delete('/api/categories?_id=' + _id)
          fetchCategories()
          swalWithBootstrapButtons.fire(
            'Deletado!',
            'Categoria deletada com sucesso.',
            'success'
          )
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            'Cancelado',
            'Sua categora está salva :)',
            'error'
          )
        }
      })
  }

  function addPropertie() {
    setProperties((prev) => {
      return [...prev, { name: '', values: '' }]
    })
  }

  function handlePropertyNameChange(
    index: number,
    property: { name: string; values: string },
    newName: string
  ) {
    setProperties((prev) => {
      const updatedProperties = [...prev]
      updatedProperties[index].name = newName
      return updatedProperties
    })
  }

  function handlePropertyValueChange(
    index: number,
    property: { name: string; values: string },
    newValues: string
  ) {
    setProperties((prev) => {
      const updatedProperties = [...prev]
      updatedProperties[index].values = newValues
      return updatedProperties
    })
  }

  function removeProperty(indexToRemove: number) {
    setProperties((prev) => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove
      })
    })
  }

  return (
    <Layout>
      <h1 className="dark:textDarkMode">Categorias</h1>
      <label>
        {editedCategory
          ? `Editando categoria: ${editedCategory.name}`
          : 'Criar nova categoria'}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder={'Nome da categoria'}
            onChange={(ev) => setName(ev.target.value)}
            value={name}
          />
          <select
            onChange={(ev) => setParentCategory(ev.target.value)}
            value={parentCategory}
          >
            <option>Sem categoria</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option value={category._id}>{category.name}</option>
              ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block">
            {editedCategory ? 'Editando propriedades' : 'Propriedades'}
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn-default text-sm"
              onClick={addPropertie}
            >
              Adicionar nova propriedade
            </button>
            <button
              type="button"
              className="btn-default text-sm"
              onClick={() => setProperties([])}
            >
              Limpar propriedades
            </button>
          </div>
          {properties?.length > 0 ? (
            properties.map((property, index) => (
              <div className="flex gap-1 my-2">
                <input
                  type="text"
                  className="mb-0"
                  value={property.name}
                  onChange={(ev) =>
                    handlePropertyNameChange(index, property, ev.target.value)
                  }
                  placeholder="Nome da propriedade (exemplo: cor)"
                />
                <input
                  type="text"
                  className="mb-0"
                  value={property.values}
                  onChange={(ev) =>
                    handlePropertyValueChange(index, property, ev.target.value)
                  }
                  placeholder="Valores, separados por virgulas"
                />
                <button
                  type="button"
                  onClick={() => removeProperty(index)}
                  className="btn-default"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                  {/* SVG remove */}
                </button>
              </div>
            ))
          ) : (
            <></>
          )}
        </div>
        <div className="flex gap-1">
          <button type="submit" className="btn-primary">
            Salvar
          </button>
          {editedCategory && (
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                setEditedCategory(null)
                setName('')
                setParentCategory('')
                setProperties([])
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
      {!editedCategory && (
        <table className="basic mt-4">
          <thead>
            <tr>
              <td>Nome da categoria</td>
              <td>Categoria principal</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 &&
              categories.map((category) => (
                <tr>
                  <td>{category.name}</td>
                  <td>{category?.parent?.name}</td>
                  <td>
                    <button
                      className="btn-primary mr-1"
                      type="button"
                      onClick={() => editCategory(category)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                        />
                      </svg>
                      {/* SVG edit */}
                    </button>
                    <button
                      className="btn-primary"
                      type="button"
                      onClick={() => deleteCategory(category)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>

                      {/* SVG delete */}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </Layout>
  )
}
