'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Building2, Plus, Edit, Trash2, Eye, MapPin } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';
import { DataTable } from '@/components/admin/DataTable';
import { useGetPropertiesQuery, useDeletePropertyMutation, ApiProperty } from '@/lib/store/api/propertyApi';

export default function PropertiesManagement() {
  const { data, isLoading, error } = useGetPropertiesQuery({ page_size: 1000 }); // Getting all for admin view for now
  const [deleteProperty, { isLoading: isDeleting }] = useDeletePropertyMutation();

  const properties = data?.results || [];

  const handleDelete = async (propertyId: string, propertyTitle: string) => {
    if (confirm(`Are you sure you want to delete "${propertyTitle}"?`)) {
      const toastId = `delete-${propertyId}`;

      try {
        toast.loading('Deleting property...', { id: toastId });

        await deleteProperty(propertyId).unwrap();

        toast.success('Property deleted successfully!', { id: toastId });
      } catch (error: any) {
        console.error('Error deleting property:', error);
        toast.error(error?.data?.detail || error?.data?.message || 'Failed to delete property', { id: toastId });
      }
    }
  };

  const columns: ColumnDef<ApiProperty>[] = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: 'Property',
        cell: ({ row }) => {
          const property = row.original;
          // Handle images which might be string[] or object[] based on my type definition
          // Assuming backend returns what we defined in ApiProperty (list of objects or strings)
          // Ideally we check type but for now let's assume valid access or optional chaining
          const firstImage = Array.isArray(property.images) && property.images.length > 0
            ? (typeof property.images[0] === 'string' ? property.images[0] : property.images[0].image)
            : null;

          return (
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-lg bg-gray-200 mr-4 overflow-hidden shrink-0">
                {firstImage && (
                  <img
                    src={firstImage}
                    alt={property.title}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900 line-clamp-1">
                  {property.title}
                </div>
                <div className="text-sm text-gray-500">
                  {property.bedrooms} bed • {property.bathrooms} bath
                </div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'location',
        header: 'Location',
        cell: ({ row }) => (
          <div className="flex items-center text-sm text-gray-900">
            <MapPin className="h-4 w-4 text-gray-400 mr-1" />
            {row.original.location}
          </div>
        ),
      },
      {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => {
          const property = row.original;
          return (
            <div className="text-sm font-semibold text-gray-900">
              {property.currency}{Number(property.price).toLocaleString()}
              {property.status === 'rent' && (
                <span className="text-gray-500 font-normal">/night</span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <span
              className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${status === 'rent'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-green-100 text-green-800'
                }`}
            >
              For {status === 'rent' ? 'Rent' : 'Sale'}
            </span>
          );
        },
      },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => (
          <div className="text-sm text-gray-900">{row.original.type}</div>
        ),
      },
      {
        id: 'actions',
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
          const property = row.original;
          return (
            <div className="flex items-center justify-end gap-2">
              <Link href={`/admin/properties/${property.id}`}>
                <button className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded transition-colors">
                  <Eye className="h-4 w-4" />
                </button>
              </Link>
              <Link href={`/admin/properties/${property.id}/edit`}>
                <button className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition-colors">
                  <Edit className="h-4 w-4" />
                </button>
              </Link>
              <button
                onClick={() => handleDelete(property.id, property.title)}
                className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded transition-colors"
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        },
      },
    ],
    [isDeleting]
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600 mt-1">
            Manage your property listings ({properties.length} total)
          </p>
        </div>
        <Link href="/admin/properties/new">
          <button className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm">
            <Plus className="h-5 w-5" />
            Add Property
          </button>
        </Link>
      </div>

      {/* Data Table */}
      {isLoading ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading properties...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-white rounded-xl border border-red-100">
          <p className="text-red-600">Error loading properties</p>
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <Building2 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p className="text-xl text-gray-600 mb-2">No properties found</p>
          <p className="text-gray-500 mb-6">Get started by adding your first property</p>
          <Link href="/admin/properties/new">
            <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors">
              Add Property
            </button>
          </Link>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={properties}
          searchKey="title"
          searchPlaceholder="Search properties..."
          pageSize={20}
        />
      )}
    </div>
  );
}
