import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import { classNames } from '@/utils/classNames';

interface TabItem {
  key: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  defaultIndex?: number;
  onChange?: (index: number) => void;
  variant?: 'underline' | 'pills' | 'boxed';
}

export function Tabs({
  items,
  defaultIndex = 0,
  onChange,
  variant = 'underline',
}: TabsProps) {
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);

  const handleChange = (index: number) => {
    setSelectedIndex(index);
    onChange?.(index);
  };

  // Styling based on variant
  const getTabListClass = () => {
    switch (variant) {
      case 'pills':
        return 'flex flex-wrap gap-2 p-1 bg-gray-100 rounded-lg';
      case 'boxed':
        return 'flex flex-wrap border-b border-gray-200';
      case 'underline':
      default:
        return 'flex flex-wrap gap-2 sm:gap-8 border-b border-gray-200';
    }
  };

  const getTabClass = (selected: boolean) => {
    switch (variant) {
      case 'pills':
        return classNames(
          'px-3 py-2 text-sm font-medium rounded-md focus:outline-none',
          selected
            ? 'bg-white text-gray-900 shadow'
            : 'text-gray-500 hover:text-gray-700'
        );
      case 'boxed':
        return classNames(
          'px-3 py-2 sm:px-4 text-sm font-medium border-t border-l border-r -mb-px focus:outline-none',
          selected
            ? 'bg-white text-gray-900 border-gray-200 rounded-t-md'
            : 'text-gray-500 hover:text-gray-700 border-transparent'
        );
      case 'underline':
      default:
        return classNames(
          'py-2 sm:py-4 px-1 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap focus:outline-none',
          selected
            ? 'text-indigo-600 border-indigo-600'
            : 'text-gray-500 border-transparent hover:border-gray-300 hover:text-gray-700'
        );
    }
  };

  return (
    <Tab.Group selectedIndex={selectedIndex} onChange={handleChange}>
      <Tab.List className={getTabListClass()}>
        {items.map((item) => (
          <Tab
            key={item.key}
            className={({ selected }) => getTabClass(selected)}
          >
            <div className="flex items-center">
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.label}
            </div>
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className="mt-4">
        {items.map((item) => (
          <Tab.Panel key={item.key}>{item.content}</Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
}
