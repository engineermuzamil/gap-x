import { motion } from 'framer-motion'
import { LayoutGridIcon, ListIcon } from 'lucide-react'
import { Button } from '../../components/ui/button'

type ViewType = 'grid' | 'list'

interface ViewSwitcherProps {
  currentView: ViewType
  onChange: (view: ViewType) => void
}

export default function ViewSwitcher({ currentView, onChange }: ViewSwitcherProps) {
  return (
    // Wrapper stays the same, buttons replaced with ShadCN Button
    <div className="bg-[#2C2C2E] rounded-lg p-1 flex gap-1">
      <motion.div whileTap={{ scale: 0.95 }}>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onChange('grid')}
          className={`p-2 h-8 w-8 ${
            currentView === 'grid'
              ? 'bg-[#3A3A3C] text-white hover:bg-[#3A3A3C]'
              : 'text-[#98989D] hover:text-white hover:bg-transparent'
          }`}
        >
          <LayoutGridIcon size={18} />
        </Button>
      </motion.div>

      <motion.div whileTap={{ scale: 0.95 }}>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onChange('list')}
          className={`p-2 h-8 w-8 ${
            currentView === 'list'
              ? 'bg-[#3A3A3C] text-white hover:bg-[#3A3A3C]'
              : 'text-[#98989D] hover:text-white hover:bg-transparent'
          }`}
        >
          <ListIcon size={18} />
        </Button>
      </motion.div>
    </div>
  )
}
