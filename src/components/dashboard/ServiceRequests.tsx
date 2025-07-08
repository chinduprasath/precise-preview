
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
      return <Badge variant="secondary">Pending Approval</Badge>;
    case 'approved':
      return <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">Awaiting Payment</Badge>;
    case 'rejected':
      return <Badge variant="destructive">Rejected</Badge>;
    case 'paid':
      return <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">Paid</Badge>;
    case 'completed':
      return <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">Completed</Badge>;
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
          <h3 className="text-lg font-semibold mb-4 text-foreground">Active Requests</h3>
          <div className="space-y-4">
            {activeRequests.map(request => (
              <Card key={request.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-foreground">{request.influencerName}</h4>
                      <p className="text-sm text-muted-foreground">
                         {request.serviceType.charAt(0).toUpperCase() + request.serviceType.slice(1)} on {Array.isArray(request.platform) ? request.platform.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ') : request.platform.charAt(0).toUpperCase() + request.platform.slice(1)}
                      </p>
                    </div>
                    <div>
                      {getStatusBadge(request.status)}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{request.description}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-lg font-bold text-foreground">₹{request.price}</div>
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
          <h3 className="text-lg font-semibold mb-4 text-foreground">Past Requests</h3>
          <div className="space-y-4">
            {completedRequests.map(request => (
              <Card key={request.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-foreground">{request.influencerName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {request.serviceType.charAt(0).toUpperCase() + request.serviceType.slice(1)} on {Array.isArray(request.platform) ? request.platform.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ') : request.platform.charAt(0).toUpperCase() + request.platform.slice(1)}
                      </p>
                    </div>
                    <div>
                      {getStatusBadge(request.status)}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{request.description}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-lg font-bold text-foreground">₹{request.price}</div>
                    {(request.status === 'paid' || request.status === 'completed') && (
                      <Button size="sm" variant="outline" onClick={() => window.location.href = '/reach'}>
                        View Analytics <ExternalLink className="ml-1 h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {requests.length === 0 && (
        <div className="text-center py-12 bg-secondary rounded-lg">
          <h3 className="text-lg font-medium text-foreground">No service requests</h3>
          <p className="mt-1 text-muted-foreground">Start by browsing influencers and requesting their services.</p>
          <Button className="mt-4" onClick={() => window.location.href = '/influencers'}>
            Find Influencers
          </Button>
        </div>
      )}
    </div>
  );
};

export default ServiceRequests;
