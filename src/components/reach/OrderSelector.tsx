import React, { useState } from 'react';
import { Search, Check } from 'lucide-react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';

export interface OrderData {
  id: string;
  name: string;
  orderNumber: string;
  date: string;
  influencer: string;
  status: 'processing' | 'shipped' | 'delivered' | 'completed';
  value: number;
  description?: string;
}

interface OrderSelectorProps {
  orders: OrderData[];
  selectedOrderId: string;
  onOrderSelect: (orderId: string) => void;
  className?: string;
}

const OrderSelector: React.FC<OrderSelectorProps> = ({ 
  orders, 
  selectedOrderId, 
  onOrderSelect,
  className
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  const selectedOrder = orders.find(order => order.id === selectedOrderId);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.influencer.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className={cn("space-y-1", className)}>
      <label className="text-sm font-medium text-gray-700">Campaign</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            className="flex items-center justify-between w-full px-4 py-2 text-sm border rounded-md bg-background hover:bg-accent/50 h-10"
            role="combobox"
            aria-expanded={open}
          >
            <div className="flex flex-col items-start truncate">
              <span className="font-medium truncate">{selectedOrder?.name || "Select a campaign"}</span>
              {selectedOrder && (
                <span className="text-xs text-muted-foreground truncate">
                  {selectedOrder.orderNumber} • {formatDate(selectedOrder.date)}
                </span>
              )}
            </div>
            <span className="text-muted-foreground">▼</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[350px] p-0" align="start">
          <Command>
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput 
                placeholder="Search campaigns..." 
                value={searchTerm}
                onValueChange={setSearchTerm}
                className="h-9"
              />
            </div>
            <CommandList>
              <CommandEmpty>No campaigns found.</CommandEmpty>
              {filteredOrders.length > 0 && (
                <CommandGroup>
                  {filteredOrders.map((order) => (
                    <CommandItem
                      key={order.id}
                      value={order.id}
                      onSelect={() => {
                        onOrderSelect(order.id);
                        setOpen(false);
                      }}
                      className="flex items-center justify-between py-3"
                    >
                      <div>
                        <p className="font-medium">{order.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.orderNumber} • {formatDate(order.date)}
                        </p>
                      </div>
                      {selectedOrderId === order.id && (
                        <Check className="w-4 h-4" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default OrderSelector;
