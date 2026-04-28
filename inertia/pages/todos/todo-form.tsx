import type React from 'react'
import LabelPicker from '../../lib/label-picker'
import type { Label } from '../../lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label as FormLabel } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const PRIORITY_OPTIONS = [
  { value: 'high', label: '🔴 High' },
  { value: 'medium', label: '🟡 Medium' },
  { value: 'low', label: '🟢 Low' },
] as const

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
] as const

interface TodoFormProps {
  data: {
    title: string
    description: string
    labelIds: number[]
    priority: string
    status: string
  }
  setData: (field: string, value: any) => void
  submit: (e: React.FormEvent) => void
  processing: boolean
  handleKeyDown: (e: React.KeyboardEvent) => void
  isEditing: boolean
  allLabels: Label[]
}

export default function TodoForm({
  data,
  setData,
  submit,
  processing,
  handleKeyDown,
  isEditing,
  allLabels,
}: TodoFormProps) {
  return (
    <Card className="bg-[#2C2C2E] border-[#3A3A3C]">
      <CardHeader>
        <CardTitle className="text-white text-xl">{isEditing ? 'Edit Todo' : 'New Todo'}</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <FormLabel className="text-[#98989D]">Title</FormLabel>
            <Input
              type="text"
              value={data.title}
              onChange={(e) => setData('title', e.target.value)}
              placeholder="Todo title"
              required
              className="bg-[#3A3A3C] border-none text-white placeholder:text-[#98989D] focus-visible:ring-[#0A84FF]"
            />
          </div>

          <div className="space-y-1.5">
            <FormLabel className="text-[#98989D]">Description</FormLabel>
            <Textarea
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Todo description (optional)"
              className="bg-[#3A3A3C] border-none text-white placeholder:text-[#98989D] focus-visible:ring-[#0A84FF] min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <FormLabel className="text-[#98989D]">Priority</FormLabel>
              <select
                value={data.priority}
                onChange={(e) => setData('priority', e.target.value)}
                className="w-full px-3 py-2 bg-[#3A3A3C] text-white text-sm rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-[#0A84FF] cursor-pointer"
              >
                {PRIORITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <FormLabel className="text-[#98989D]">Status</FormLabel>
              <select
                value={data.status}
                onChange={(e) => setData('status', e.target.value)}
                className="w-full px-3 py-2 bg-[#3A3A3C] text-white text-sm rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-[#0A84FF] cursor-pointer"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <LabelPicker
            allLabels={allLabels}
            selectedIds={data.labelIds}
            onChange={(ids) => setData('labelIds', ids)}
          />

          <Button
            type="submit"
            disabled={processing}
            className="w-full bg-[#0A84FF] hover:bg-[#0A74FF] text-white"
          >
            {processing
              ? isEditing
                ? 'Saving...'
                : 'Adding...'
              : isEditing
                ? 'Save Todo'
                : 'Add Todo'}
          </Button>

          <p className="text-center text-sm text-[#98989D]">
            Hit{' '}
            {typeof navigator !== 'undefined' && navigator.platform?.includes('Mac') ? '⌘' : 'Ctrl'}{' '}
            + Enter to save
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
