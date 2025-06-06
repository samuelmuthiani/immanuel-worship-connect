
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface ResponsiveTableProps {
  children: React.ReactNode;
  className?: string;
  maxHeight?: string;
}

export const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  children,
  className = '',
  maxHeight = '500px'
}) => {
  return (
    <div className="w-full">
      {/* Desktop view */}
      <div className="hidden sm:block">
        <ScrollArea className={`w-full rounded-md border`} style={{ maxHeight }}>
          <Table className={className}>
            {children}
          </Table>
        </ScrollArea>
      </div>
      
      {/* Mobile view - will be handled by individual table implementations */}
      <div className="sm:hidden">
        <ScrollArea className={`w-full`} style={{ maxHeight }}>
          <div className={cn('space-y-3', className)}>
            {children}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

interface MobileTableCardProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileTableCard: React.FC<MobileTableCardProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={cn(
      'rounded-lg border bg-card p-4 shadow-sm space-y-2',
      className
    )}>
      {children}
    </div>
  );
};

interface MobileTableRowProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

export const MobileTableRow: React.FC<MobileTableRowProps> = ({
  label,
  value,
  className = ''
}) => {
  return (
    <div className={cn('flex justify-between items-start gap-2', className)}>
      <span className="text-sm font-medium text-muted-foreground min-w-0 flex-shrink-0">
        {label}:
      </span>
      <span className="text-sm text-right min-w-0 flex-1">
        {value}
      </span>
    </div>
  );
};

export { Table, TableBody, TableCell, TableHead, TableHeader, TableRow };
