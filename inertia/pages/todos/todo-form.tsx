import type React from 'react'
import { motion } from 'framer-motion'
import LabelPicker from '../../lib/label-picker'
import type { Label } from '../../lib/types'

import { Textarea } from '../../components/ui/textarea'
import { Checkbox } from '../../components/ui/checkbox'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label as FormLabel } from '../../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'

interface TodoFormProps {
  data: {
    title: string
    description: string
    isCompleted: boolean
    labelIds: number[]
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
    // ShadCN Card replaces raw motion.div with manual styles
    <Card className="bg-[#2C2C2E] border-[#3A3A3C]">
      <CardHeader>
        <CardTitle className="text-white text-xl">{isEditing ? 'Edit Todo' : 'New Todo'}</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <FormLabel className="text-[#98989D]">Title</FormLabel>
            {/* ShadCN Input replaces raw input */}
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
            {/* ShadCN Textarea replaces raw textarea */}
            <Textarea
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Todo description (optional)"
              className="bg-[#3A3A3C] border-none text-white placeholder:text-[#98989D] focus-visible:ring-[#0A84FF] min-h-[120px]"
            />
          </div>

          <LabelPicker
            allLabels={allLabels}
            selectedIds={data.labelIds}
            onChange={(ids) => setData('labelIds', ids)}
          />

          {/* ShadCN Checkbox + Label pair — must use htmlFor/id to link them */}
          <div className="flex items-center gap-3">
            <Checkbox
              id="isCompleted"
              checked={data.isCompleted}
              onCheckedChange={(checked) => setData('isCompleted', checked)}
              className="border-[#98989D] data-[state=checked]:bg-[#0A84FF] data-[state=checked]:border-[#0A84FF]"
            />
            <FormLabel htmlFor="isCompleted" className="text-sm text-[#98989D] cursor-pointer">
              Mark as completed
            </FormLabel>
          </div>

          {/* ShadCN Button replaces raw button */}
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
