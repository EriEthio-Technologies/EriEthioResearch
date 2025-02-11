import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronDown, Trash2, Archive, Clock, Tag } from 'lucide-react';

interface BulkActionsMenuProps {
  selectedItems: string[];
  onBulkAction: (action: string, data?: any) => Promise<void>;
  actions: {
    name: string;
    label: string;
    icon: any;
    requiresConfirmation?: boolean;
    requiresInput?: boolean;
    inputType?: 'select' | 'text' | 'tags';
    options?: string[];
  }[];
}

export default function BulkActionsMenu({ selectedItems, onBulkAction, actions }: BulkActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [inputTag, setInputTag] = useState('');

  const handleActionClick = (actionName: string) => {
    const action = actions.find(a => a.name === actionName);
    if (!action) return;

    setSelectedAction(actionName);

    if (action.requiresConfirmation) {
      setShowConfirmation(true);
    } else if (action.requiresInput) {
      // Keep menu open for input
      setInputValue('');
      setTags([]);
    } else {
      handleConfirmAction(actionName);
    }
  };

  const handleConfirmAction = async (actionName: string) => {
    const action = actions.find(a => a.name === actionName);
    if (!action) return;

    try {
      if (action.requiresInput) {
        if (action.inputType === 'tags') {
          await onBulkAction(actionName, tags);
        } else {
          await onBulkAction(actionName, inputValue);
        }
      } else {
        await onBulkAction(actionName);
      }

      // Reset states
      setIsOpen(false);
      setSelectedAction(null);
      setShowConfirmation(false);
      setInputValue('');
      setTags([]);
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const handleAddTag = () => {
    if (inputTag && !tags.includes(inputTag)) {
      setTags([...tags, inputTag]);
      setInputTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  if (selectedItems.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-colors"
      >
        <span>Bulk Actions ({selectedItems.length})</span>
        <ChevronDown className={`w-4 h-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 mt-2 w-64 bg-black/90 backdrop-blur-sm rounded-lg border border-neon-cyan/20 shadow-xl z-50"
        >
          {!selectedAction && (
            <div className="py-2">
              {actions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.name}
                    onClick={() => handleActionClick(action.name)}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-neon-cyan/10 hover:text-neon-cyan transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{action.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {selectedAction && showConfirmation && (
            <div className="p-4 space-y-4">
              <p className="text-gray-300">Are you sure you want to perform this action on {selectedItems.length} items?</p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setSelectedAction(null);
                    setShowConfirmation(false);
                  }}
                  className="px-3 py-1 text-gray-400 hover:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleConfirmAction(selectedAction)}
                  className="px-3 py-1 bg-neon-magenta/20 text-neon-magenta border border-neon-magenta rounded hover:bg-neon-magenta/30"
                >
                  Confirm
                </button>
              </div>
            </div>
          )}

          {selectedAction && !showConfirmation && actions.find(a => a.name === selectedAction)?.requiresInput && (
            <div className="p-4 space-y-4">
              {actions.find(a => a.name === selectedAction)?.inputType === 'select' ? (
                <select
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full px-3 py-2 bg-black/50 border border-neon-cyan/20 rounded text-gray-300 focus:border-neon-cyan focus:outline-none"
                >
                  <option value="">Select an option</option>
                  {actions.find(a => a.name === selectedAction)?.options?.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : actions.find(a => a.name === selectedAction)?.inputType === 'tags' ? (
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={inputTag}
                      onChange={(e) => setInputTag(e.target.value)}
                      className="flex-1 px-3 py-2 bg-black/50 border border-neon-cyan/20 rounded text-gray-300 focus:border-neon-cyan focus:outline-none"
                      placeholder="Enter a tag"
                    />
                    <button
                      onClick={handleAddTag}
                      className="px-3 py-1 bg-neon-magenta/20 text-neon-magenta border border-neon-magenta rounded hover:bg-neon-magenta/30"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center space-x-1 px-2 py-1 bg-neon-cyan/10 text-neon-cyan rounded"
                      >
                        <span>{tag}</span>
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="text-neon-cyan/50 hover:text-neon-cyan"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full px-3 py-2 bg-black/50 border border-neon-cyan/20 rounded text-gray-300 focus:border-neon-cyan focus:outline-none"
                  placeholder="Enter value"
                />
              )}
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setSelectedAction(null);
                    setInputValue('');
                    setTags([]);
                  }}
                  className="px-3 py-1 text-gray-400 hover:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleConfirmAction(selectedAction)}
                  className="px-3 py-1 bg-neon-magenta/20 text-neon-magenta border border-neon-magenta rounded hover:bg-neon-magenta/30"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
} 