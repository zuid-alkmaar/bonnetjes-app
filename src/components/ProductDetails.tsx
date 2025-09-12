import { X, Edit, Trash2 } from 'lucide-react';
import { Product } from '@/types';

interface ProductDetailsProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

const ProductDetails = ({ product, isOpen, onClose, onEdit, onDelete }: ProductDetailsProps) => {
  if (!isOpen || !product) return null;

  const handleDelete = () => {
    onDelete(product.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Product Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <p className="mt-1 text-sm text-gray-900">{product.name}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <p className="mt-1 text-sm text-gray-900">€{product.price.toFixed(2)}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <p className="mt-1 text-sm text-gray-900">{product.category}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <p className="mt-1 text-sm text-gray-900">{product.description}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              product.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {product.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Created</label>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(product.createdAt).toLocaleString()}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Last Updated</label>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(product.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6">
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 flex items-center"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
          <button
            onClick={() => onEdit(product)}
            className="px-4 py-2 text-sm font-medium text-white bg-amber-600 border border-transparent rounded-md hover:bg-amber-700 flex items-center"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
