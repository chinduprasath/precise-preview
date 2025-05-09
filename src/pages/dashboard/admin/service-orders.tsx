
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import ServiceOrderFilters from '@/components/admin/serviceOrders/ServiceOrderFilters';
import ServiceOrderTable from '@/components/admin/serviceOrders/ServiceOrderTable';
import ServiceOrderDetail from '@/components/admin/serviceOrders/ServiceOrderDetail';
import ServiceOrderEdit from '@/components/admin/serviceOrders/ServiceOrderEdit';
import { ServiceOrder } from '@/types/serviceOrder';
import { mockServiceOrders, mockTeamMembers } from '@/data/serviceOrders';

const ServiceOrdersPage = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<ServiceOrder[]>([]);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data from an API
    const loadData = () => {
      setIsLoading(true);
      setTimeout(() => {
        setOrders(mockServiceOrders);
        setFilteredOrders(mockServiceOrders);
        setIsLoading(false);
      }, 800);
    };
    
    loadData();
  }, []);

  const handleViewOrder = (order: ServiceOrder) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const handleEditOrder = (order: ServiceOrder) => {
    setSelectedOrder(order);
    setIsEditOpen(true);
    // Close detail modal if it's open
    if (isDetailOpen) {
      setIsDetailOpen(false);
    }
  };

  const handleSaveOrder = (updatedOrder: ServiceOrder) => {
    // In a real app, this would call an API to update the order
    const updatedOrders = orders.map(order => 
      order.id === updatedOrder.id ? updatedOrder : order
    );
    
    setOrders(updatedOrders);
    setFilteredOrders(
      filteredOrders.map(order => 
        order.id === updatedOrder.id ? updatedOrder : order
      )
    );
    
    toast({
      title: "Order Updated",
      description: `Order ${updatedOrder.orderId} has been successfully updated.`,
    });
  };

  const handleFilterChange = (filters: any) => {
    let filtered = [...orders];
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        order => order.orderId.toLowerCase().includes(searchLower) || 
                order.userName.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.status) {
      filtered = filtered.filter(order => order.status === filters.status);
    }
    
    if (filters.serviceType) {
      filtered = filtered.filter(order => order.serviceType === filters.serviceType);
    }
    
    // Date filtering would be implemented here
    
    setFilteredOrders(filtered);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-2xl font-bold">Service Orders</h1>
              <Button>Export Orders</Button>
            </div>

            <ServiceOrderFilters onFilterChange={handleFilterChange} />

            <Card className="border border-border">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <ServiceOrderTable
                  orders={filteredOrders}
                  onViewOrder={handleViewOrder}
                  onEditOrder={handleEditOrder}
                />
              )}
            </Card>

            <ServiceOrderDetail
              order={selectedOrder}
              isOpen={isDetailOpen}
              onOpenChange={setIsDetailOpen}
              onEdit={handleEditOrder}
            />

            <ServiceOrderEdit
              order={selectedOrder}
              isOpen={isEditOpen}
              onOpenChange={setIsEditOpen}
              onSave={handleSaveOrder}
              teamMembers={mockTeamMembers}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ServiceOrdersPage;
