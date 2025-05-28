
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, Search, Filter, Trash2 } from 'lucide-react';
import { exportToCSV, bulkDeleteItems } from '@/utils/adminUtils';
import { useToast } from '@/hooks/use-toast';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
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

  // Filter and sort data
  const filteredData = data.filter(item =>
    Object.values(item).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedData = sortBy ? 
    [...filteredData].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortOrder === 'asc' ? comparison : -comparison;
    }) : filteredData;

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
    toast({
      title: "Export Complete",
      description: `${title} data has been exported to CSV.`,
    });
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;
    
    if (confirm(`Are you sure you want to delete ${selectedItems.length} items?`)) {
      const result = await bulkDeleteItems(tableName, selectedItems);
      if (result.success) {
        toast({
          title: "Items Deleted",
          description: `${selectedItems.length} items have been deleted.`,
        });
        setSelectedItems([]);
        onRefresh();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete items. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            <Button
              variant="outline"
              onClick={handleExport}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            {selectedItems.length > 0 && (
              <Button
                variant="destructive"
                onClick={handleBulkDelete}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete ({selectedItems.length})
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">
                  <Checkbox
                    checked={selectedItems.length === sortedData.length && sortedData.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`text-left p-3 font-medium ${
                      column.sortable ? 'cursor-pointer hover:bg-gray-50' : ''
                    }`}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center gap-2">
                      {column.label}
                      {column.sortable && sortBy === column.key && (
                        <span className="text-xs">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item, index) => (
                <tr key={item.id || index} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                    />
                  </td>
                  {columns.map((column) => (
                    <td key={column.key} className="p-3">
                      {typeof item[column.key] === 'string' && item[column.key].includes('T') 
                        ? new Date(item[column.key]).toLocaleString()
                        : String(item[column.key] || '-')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {sortedData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'No results found' : 'No data available'}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedDataTable;
