
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, ExternalLink } from 'lucide-react';
import { InfluencerRequest, RequestStatus } from '@/types/request';

interface RequestsListProps {
  requests: InfluencerRequest[];
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

const getStatusBadge = (status: RequestStatus) => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
    case 'approved':
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Approved</Badge>;
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

const RequestsList: React.FC<RequestsListProps> = ({ requests, onApprove, onReject }) => {
  // Group requests by status
  const pendingRequests = requests.filter(req => req.status === 'pending');
  const otherRequests = requests.filter(req => req.status !== 'pending');
  
  return (
    <div className="space-y-6">
      {pendingRequests.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Pending Approval</h3>
          <div className="space-y-4">
            {pendingRequests.map(request => (
              <Card key={request.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4 border-b">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{request.businessName}</h4>
                        <p className="text-sm text-gray-500">
                          {request.serviceType.charAt(0).toUpperCase() + request.serviceType.slice(1)} on {request.platform.charAt(0).toUpperCase() + request.platform.slice(1)}
                        </p>
                      </div>
                      <div>
                        {getStatusBadge(request.status)}
                      </div>
                    </div>
                    <p className="text-sm mt-2">{request.description}</p>
                  </div>
                  <div className="p-4 bg-gray-50 flex justify-between items-center">
                    <div className="text-lg font-bold">₹{request.price}</div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => onReject(request.id)}
                      >
                        <X className="mr-1 h-4 w-4" /> Reject
                      </Button>
                      <Button 
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => onApprove(request.id)}
                      >
                        <Check className="mr-1 h-4 w-4" /> Accept
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {otherRequests.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Previous Requests</h3>
          <div className="space-y-4">
            {otherRequests.map(request => (
              <Card key={request.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{request.businessName}</h4>
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
                    <div className="text-lg font-bold">₹{request.price}</div>
                    {request.status === 'approved' && (
                      <Button size="sm" variant="outline">
                        View Details <ExternalLink className="ml-1 h-3 w-3" />
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
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900">No requests yet</h3>
          <p className="mt-1 text-gray-500">When businesses request your services, they'll appear here.</p>
        </div>
      )}
    </div>
  );
};

export default RequestsList;
