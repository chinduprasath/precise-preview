
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface Product {
  id: string;
  name: string;
  popularity: number;
  salesPercentage: number;
  color: string;
}

const ProductsList: React.FC = () => {
  const products: Product[] = [
    { 
      id: '01', 
      name: 'Home Decore Range', 
      popularity: 80, 
      salesPercentage: 46,
      color: 'bg-emerald-500'
    },
    { 
      id: '02', 
      name: 'Disney Princess Dress', 
      popularity: 65, 
      salesPercentage: 17,
      color: 'bg-blue-500'
    },
    { 
      id: '03', 
      name: 'Bathroom Essentials', 
      popularity: 70, 
      salesPercentage: 19,
      color: 'bg-emerald-500'
    },
    { 
      id: '04', 
      name: 'Apple Smartwatch', 
      popularity: 60, 
      salesPercentage: 29,
      color: 'bg-purple-500'
    }
  ];

  return (
    <Card className="shadow-sm border-gray-200">
      <CardContent className="p-4">
        <h2 className="text-lg font-medium mb-4">Top Products</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 text-sm">
                <th className="pb-4 font-medium">#</th>
                <th className="pb-4 font-medium">Name</th>
                <th className="pb-4 font-medium">Popularity</th>
                <th className="pb-4 font-medium">Sales</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-t border-gray-100">
                  <td className="py-4 text-sm">{product.id}</td>
                  <td className="py-4 text-sm">{product.name}</td>
                  <td className="py-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`${product.color} h-2.5 rounded-full`} 
                        style={{ width: `${product.popularity}%` }}>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                      product.salesPercentage > 40 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : product.salesPercentage > 25 
                          ? 'bg-purple-100 text-purple-800' 
                          : product.salesPercentage > 15 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.salesPercentage}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductsList;
