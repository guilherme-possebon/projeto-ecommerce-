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
    { name: string; value: string }[]
  >([])

  useEffect(() => {
    fetchCategories()
  }, [])

  function fetchCategories() {
    axios.get('/api/categories').then((result) => {
      setCategories(result.data)
    })
  }

  // Salvar a categoria
  async function saveCategory(ev: { preventDefault: () => void }) {
    ev.preventDefault()

    if (name.length == 0) {
      // verifica se tem algo escrito no nome da categoria
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Nome invalido'
      })
      return
    }
    let data = {}

    if (parentCategory.length == 0) {
      // verifica se tem alguma categoria sendo pai dessa nova categoria
      data = { name } // se não tiver, vai mandar só o nome
    } else {
      data = { name, parentCategory } // se tiver vai enviar o nome da categoria criada junto com o pai dessa categoria
    }

    if (editedCategory) {
      await axios.put('/api/categories', { ...data, _id: editedCategory._id }) // se caso a categoria foi editada, ela será enviada ao banco de dados
      setEditedCategory(null)
    } else {
      await axios.post('/api/categories', data) // se não, só vai criar a categoria
    }
    setName('')
    setParentCategory('')
    fetchCategories()
  }
  // Editar a categoria
  function editCategory(category: CategoryInterface) {
    setEditedCategory(category)
    setName(category.name)
    if (category.parent?._id != undefined) {
      setParentCategory(category.parent?._id)
    } else {
      setParentCategory('')
    }
  }
  // Deletar categoria
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
  // Adicionar propriedade
  function addPropertie() {
    setProperties((prev) => {
      return [...prev, { name: '', value: '' }]
    })
  }
  // Mudar o nome da propriedade
  function handlePropertyNameChange(
    property: { name: string; value: string },
    ev: string
  ) {}

  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `Editing category ${editedCategory.name}`
          : 'Create new category'}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder={'Category name'}
            onChange={(ev) => setName(ev.target.value)}
            value={name}
          />
          <select
            onChange={(ev) => setParentCategory(ev.target.value)}
            value={parentCategory}
          >
            <option>No parent category</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option value={category._id}>{category.name}</option>
              ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block">Propriedades</label>
          <button
            type="button"
            className="btn-default text-sm"
            onClick={addPropertie}
          >
            Adicionar nova propriedade
          </button>
          {properties.length > 0 &&
            properties.map((property) => (
              <div className="flex gap-1 mt-1">
                <input
                  type="text"
                  value={property.name}
                  onChange={(ev) =>
                    handlePropertyNameChange(property, ev.target.value)
                  }
                  placeholder="Nome da propriedade (exemplo: cor)"
                />
                <input
                  type="text"
                  value={property.value}
                  placeholder="Valores, separados por virgulas"
                />
              </div>
            ))}
        </div>
        <button type="submit" className="btn-primary py-1">
          Save
        </button>
      </form>
      <table className="basic mt-4">
        <thead>
          <tr>
            <td>Category name</td>
            <td>Parent category</td>
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
                    onClick={() => editCategory(category)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-primary"
                    onClick={() => deleteCategory(category)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  )
}
