
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface MobileDrawerProps {
  children: React.ReactNode;
  title?: string;
  trigger?: React.ReactNode;
  side?: 'left' | 'right' | 'top' | 'bottom';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  children,
  title,
  trigger,
  side = 'left',
  open,
  onOpenChange
}) => {
  const defaultTrigger = (
    <Button variant="ghost" size="icon" className="md:hidden">
      <Menu className="h-6 w-6" />
    </Button>
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        {trigger || defaultTrigger}
      </SheetTrigger>
      <SheetContent side={side} className="w-80">
        {title && (
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
          </SheetHeader>
        )}
        <div className="mt-6">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
};
