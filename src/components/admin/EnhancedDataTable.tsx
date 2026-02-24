
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Download, Search, Trash2 } from 'lucide-react';
import { exportToCSV, bulkDeleteItems } from '@/utils/adminUtils';
import { useToast } from '@/hooks/use-toast';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

interface EnhancedDataTableProps {
  title: string;
  data: any[];
  columns: Column[];
  tableName: string;
  onRefresh: () => void;
}

const EnhancedDataTable = ({ title, data, columns, tableName, onRefresh }: EnhancedDataTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();

  const filteredData = data.filter(item =>
    Object.values(item).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedData = sortBy
    ? [...filteredData].sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        return sortOrder === 'asc' ? comparison : -comparison;
      })
    : filteredData;

  const handleSort = (columnKey: string) => {
    if (sortBy === columnKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnKey);
      setSortOrder('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedItems(checked ? sortedData.map(item => item.id) : []);
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    setSelectedItems(prev =>
      checked ? [...prev, itemId] : prev.filter(id => id !== itemId)
    );
  };

  const handleExport = () => {
    exportToCSV(sortedData, `${tableName}_export`);
    toast({ title: 'Exported', description: `${title} exported to CSV.` });
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;
    if (confirm(`Delete ${selectedItems.length} items?`)) {
      const result = await bulkDeleteItems(tableName as any, selectedItems);
      if (result.success) {
        toast({ title: 'Deleted', description: `${selectedItems.length} items removed.` });
        setSelectedItems([]);
        onRefresh();
      } else {
        toast({ title: 'Error', description: 'Failed to delete items.', variant: 'destructive' });
      }
    }
  };

  return (
    <Card className="border-border">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg text-foreground">{title}</CardTitle>
            <Badge variant="secondary" className="text-xs">{data.length}</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8 w-48 text-sm"
              />
            </div>
            <Button variant="outline" size="sm" onClick={handleExport} className="h-8">
              <Download className="h-3.5 w-3.5 mr-1" /> Export
            </Button>
            {selectedItems.length > 0 && (
              <Button variant="destructive" size="sm" onClick={handleBulkDelete} className="h-8">
                <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete ({selectedItems.length})
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 w-8">
                  <Checkbox
                    checked={selectedItems.length === sortedData.length && sortedData.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="text-left py-3 px-2 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors text-xs uppercase tracking-wider"
                    onClick={() => handleSort(column.key)}
                  >
                    <div className="flex items-center gap-1">
                      {column.label}
                      {sortBy === column.key && (
                        <span className="text-primary">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item, index) => (
                <tr key={item.id || index} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                  <td className="py-2.5 px-2">
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                    />
                  </td>
                  {columns.map((column) => (
                    <td key={column.key} className="py-2.5 px-2 text-foreground">
                      {typeof item[column.key] === 'string' && item[column.key]?.includes('T')
                        ? new Date(item[column.key]).toLocaleDateString()
                        : String(item[column.key] || '—')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {sortedData.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              {searchTerm ? 'No results found' : 'No data available'}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedDataTable;
