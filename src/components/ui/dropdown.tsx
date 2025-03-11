import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
}

export function Dropdown({ trigger, children }: DropdownProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        {trigger}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[220px] bg-white dark:bg-gray-800 rounded-md shadow-lg p-1"
          sideOffset={5}
        >
          {children}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

interface DropdownItemProps {
  children: React.ReactNode;
  onSelect?: () => void;
}

export function DropdownItem({ children, onSelect }: DropdownItemProps) {
  return (
    <DropdownMenu.Item
      className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700"
      onSelect={onSelect}
    >
      {children}
    </DropdownMenu.Item>
  );
}

export function DropdownSeparator() {
  return (
    <DropdownMenu.Separator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
  );
}
