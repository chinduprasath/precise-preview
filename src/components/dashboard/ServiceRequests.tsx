
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreditCard, ExternalLink } from 'lucide-react';
import { InfluencerRequest, RequestStatus } from '@/types/request';

interface ServiceRequestsProps {
  requests: InfluencerRequest[];
  onPayRequest: (requestId: string) => void;
}

const getStatusBadge = (status: RequestStatus) => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending Approval</Badge>;
    case 'approved':
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Awaiting Payment</Badge>;
    case 'rejected':
      return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
    case 'paid':
      return <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">Paid</Badge>;
    case 'completed':
      return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const ServiceRequests: React.FC<ServiceRequestsProps> = ({ requests, onPayRequest }) => {
  // Filter requests based on status
  const activeRequests = requests.filter(req => req.status === 'pending' || req.status === 'approved');
  const completedRequests = requests.filter(req => req.status === 'paid' || req.status === 'completed' || req.status === 'rejected');
  
  return (
    <div className="space-y-6">
      {activeRequests.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Active Requests</h3>
          <div className="space-y-4">
            {activeRequests.map(request => (
              <Card key={request.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{request.influencerName}</h4>
                      <p className="text-sm text-gray-500">
                        {request.serviceType.charAt(0).toUpperCase() + request.serviceType.slice(1)} on {request.platform.charAt(0).toUpperCase() + request.platform.slice(1)}
                      </p>
                    </div>
                    <div>
                      {getStatusBadge(request.status)}
                    </div>
                  </div>
                  <p className="text-sm">{request.description}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-lg font-bold">${request.price}</div>
                    {request.status === 'approved' && (
                      <Button 
                        size="sm"
                        onClick={() => onPayRequest(request.id)}
                      >
                        <CreditCard className="mr-1 h-4 w-4" /> Pay Now
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {completedRequests.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Past Requests</h3>
          <div className="space-y-4">
            {completedRequests.map(request => (
              <Card key={request.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{request.influencerName}</h4>
                      <p className="text-sm text-gray-500">
                        {request.serviceType.charAt(0).toUpperCase() + request.serviceType.slice(1)} on {request.platform.charAt(0).toUpperCase() + request.platform.slice(1)}
                      </p>
                    </div>
                    <div>
                      {getStatusBadge(request.status)}
                    </div>
                  </div>
                  <p className="text-sm">{request.description}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-lg font-bold">${request.price}</div>
                    {request.status === 'paid' || request.status === 'completed' ? (
                      <Button size="sm" variant="outline" onClick={() => window.location.href = '/reach'}>
                        View Analytics <ExternalLink className="ml-1 h-3 w-3" />
                      </Button>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {requests.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900">No service requests</h3>
          <p className="mt-1 text-gray-500">Start by browsing influencers and requesting their services.</p>
          <Button className="mt-4" onClick={() => window.location.href = '/influencers'}>
            Find Influencers
          </Button>
        </div>
      )}
    </div>
  );
};

export default ServiceRequests;
