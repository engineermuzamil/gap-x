import { Head, useForm, Link, router, usePage } from '@inertiajs/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { PlusIcon, XIcon, ArrowLeft } from 'lucide-react'
import ProjectCard from './project-card'
import ProjectForm from './project-form'
import ViewSwitcher from '../notes/view-switcher'

interface Project {
  id: number
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'completed'
  createdAt: string
  updatedAt: string
}

interface PaginatedProjects {
  data: Project[]
  meta: {
    currentPage: number
    lastPage: number
    perPage: number
    total: number
  }
}

type ViewType = 'grid' | 'list'

export default function Index() {
  // usePage() pulls props from Inertia
  const { projects } = usePage<{ projects: PaginatedProjects }>().props

  const [isFormVisible, setIsFormVisible] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [viewType, setViewType] = useState<ViewType>('grid')

  const { data, setData, post, put, processing, reset } = useForm({
    title: '',
    description: '',
    status: 'pending' as 'pending' | 'in-progress' | 'completed',
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingProject) {
      put(`/projects/${editingProject.id}`, {
        onSuccess: () => {
          reset()
          setEditingProject(null)
          setIsFormVisible(false)
        },
      })
    } else {
      post('/projects', {
        onSuccess: () => {
          reset()
          setIsFormVisible(false)
        },
      })
    }
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setData({ title: project.title, description: project.description, status: project.status })
    setIsFormVisible(true)
  }

  const handleDelete = (id: number) => {
    router.delete(`/projects/${id}`)
  }

  const handleToggleForm = () => {
    setIsFormVisible(!isFormVisible)
    if (isFormVisible) {
      reset()
      setEditingProject(null)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      submit(e as any)
    }
  }

  const handlePageChange = (page: number) => {
    router.get('/projects', { page }, { preserveState: true })
  }

  return (
    <>
      <Head title="Projects" />
      <div className="min-h-screen bg-[#1C1C1E] text-white">
        <div className="max-w-4xl mx-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-8"
          >
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="p-2 hover:bg-[#2C2C2E] rounded-full transition-colors duration-200"
              >
                <ArrowLeft size={24} />
              </Link>
              <h1 className="text-3xl font-bold">Projects</h1>
            </div>

            <div className="flex items-center gap-3">
              <ViewSwitcher currentView={viewType} onChange={setViewType} />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleToggleForm}
                className="bg-[#0A84FF] text-white p-3 rounded-full shadow-lg hover:bg-[#0A74FF] transition-colors duration-200"
              >
                {isFormVisible ? <XIcon size={20} /> : <PlusIcon size={20} />}
              </motion.button>
            </div>
          </motion.div>

          <AnimatePresence>
            {isFormVisible && (
              <motion.div
                initial={{ opacity: 0, y: 20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mb-6"
              >
                <ProjectForm
                  data={data}
                  setData={setData}
                  submit={submit}
                  processing={processing}
                  handleKeyDown={handleKeyDown}
                  isEditing={!!editingProject}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {!projects.data.length ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-dashed border-[#3A3A3C] bg-[#232325] px-6 py-12 text-center"
            >
              <h2 className="text-xl font-semibold">No projects yet</h2>
              <p className="mt-2 text-sm text-[#98989D]">
                Hit the + button to add your first project.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={
                viewType === 'grid' ? 'columns-1 md:columns-2 gap-3' : 'flex flex-col gap-3'
              }
            >
              <AnimatePresence>
                {projects.data.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: index * 0.05 } }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={viewType === 'grid' ? 'break-inside-avoid mb-3' : 'w-full'}
                  >
                    <ProjectCard
                      project={project}
                      viewType={viewType}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Pagination */}
          {projects.meta.lastPage > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              {Array.from({ length: projects.meta.lastPage }, (_, i) => i + 1).map((page) => (
                <motion.button
                  key={page}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePageChange(page)}
                  className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                    page === projects.meta.currentPage
                      ? 'bg-[#0A84FF] text-white'
                      : 'bg-[#2C2C2E] text-[#98989D] hover:text-white'
                  }`}
                >
                  {page}
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
