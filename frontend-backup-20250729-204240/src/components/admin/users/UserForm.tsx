import React from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AdminUser, AdminRole, Permission, ROLE_PERMISSIONS } from '@/types/admin';

const roleOptions: { value: AdminRole; label: string }[] = [
  { value: 'editor', label: 'Editor' },
  { value: 'moderator', label: 'Moderatör' },
  { value: 'admin', label: 'Admin' },
  { value: 'super_admin', label: 'Super Admin' },
];

const permissionOptions: { value: Permission; label: string }[] = [
  { value: 'dashboard.view', label: 'Dashboard Görüntüleme' },
  { value: 'admin.view', label: 'Admin Panel Erişimi' },
  { value: 'users.view', label: 'Kullanıcıları Görüntüleme' },
  { value: 'users.create', label: 'Kullanıcı Oluşturma' },
  { value: 'users.edit', label: 'Kullanıcı Düzenleme' },
  { value: 'users.delete', label: 'Kullanıcı Silme' },
  { value: 'users.manage_roles', label: 'Rol Yönetimi' },
  { value: 'blog.view', label: 'Blog Görüntüleme' },
  { value: 'blog.create', label: 'Blog Oluşturma' },
  { value: 'blog.edit', label: 'Blog Düzenleme' },
  { value: 'blog.delete', label: 'Blog Silme' },
  { value: 'blog.publish', label: 'Blog Yayınlama' },
  { value: 'voices.view', label: 'Sesler Görüntüleme' },
  { value: 'voices.create', label: 'Ses Oluşturma' },
  { value: 'voices.edit', label: 'Ses Düzenleme' },
  { value: 'voices.delete', label: 'Ses Silme' },
  { value: 'voices.publish', label: 'Ses Yayınlama' },
  { value: 'analytics.view', label: 'Analizleri Görüntüleme' },
  { value: 'system.settings', label: 'Sistem Ayarları' },
  { value: 'permissions.manage', label: 'İzin Yönetimi' },
];

// Import role permissions from types

const userFormSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  displayName: z.string().min(2, 'İsim en az 2 karakter olmalıdır').optional(),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır').optional(),
  role: z.enum(['editor', 'moderator', 'admin', 'super_admin']),
  permissions: z.array(z.string() as z.ZodType<Permission>),
  isActive: z.boolean(),
});

type UserFormData = z.infer<typeof userFormSchema>;

interface UserFormProps {
  user?: AdminUser;
  onSubmit: SubmitHandler<UserFormData>;
  onCancel: () => void;
}

export function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
  const isEditing = !!user;
  
  // Helper function to get valid role for form
  const getValidRole = (role?: AdminRole): UserFormData['role'] => {
    if (!role) return 'editor';
    // Map old roles to new ones if needed
    if (role === 'content_manager' || role === 'analytics_viewer') return 'editor';
    if (['editor', 'moderator', 'admin', 'super_admin'].includes(role)) {
      return role as UserFormData['role'];
    }
    return 'editor';
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: user?.email || '',
      displayName: user?.displayName || '',
      password: '',
      role: getValidRole(user?.role),
      permissions: user?.permissions || ROLE_PERMISSIONS.editor,
      isActive: user?.isActive ?? true,
    },
  });

  // Watch role to update permissions based on role
  const selectedRole = watch('role');

  // Handle role change to update permissions
  const handleRoleChange = (role: AdminRole) => {
    setValue('permissions', ROLE_PERMISSIONS[role]);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            E-posta
          </label>
          <div className="mt-1">
            <input
              id="email"
              type="email"
              {...register('email')}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
            Ad Soyad
          </label>
          <div className="mt-1">
            <input
              id="displayName"
              type="text"
              {...register('displayName')}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
            {errors.displayName && (
              <p className="mt-1 text-sm text-red-600">{errors.displayName.message}</p>
            )}
          </div>
        </div>

        {!isEditing && (
          <div className="sm:col-span-3">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Şifre
            </label>
            <div className="mt-1">
              <input
                id="password"
                type="password"
                {...register('password')}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>
        )}

        <div className="sm:col-span-3">
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Rol
          </label>
          <div className="mt-1">
            <select
              id="role"
              {...register('role')}
              onChange={(e) => handleRoleChange(e.target.value as AdminRole)}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            >
              {roleOptions.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>
        </div>

        <div className="sm:col-span-6">
          <label className="block text-sm font-medium text-gray-700">
            İzinler
          </label>
          <div className="mt-2 space-y-2">
            <Controller
              name="permissions"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {permissionOptions.map((permission) => (
                    <div key={permission.value} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`permission-${permission.value}`}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        value={permission.value}
                        checked={field.value.includes(permission.value)}
                        onChange={(e) => {
                          const value = permission.value;
                          const newPermissions = e.target.checked
                            ? [...field.value, value]
                            : field.value.filter((p) => p !== value);
                          field.onChange(newPermissions);
                        }}
                      />
                      <label
                        htmlFor={`permission-${permission.value}`}
                        className="ml-2 block text-sm text-gray-700"
                      >
                        {permission.label}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            />
            {errors.permissions && (
              <p className="mt-1 text-sm text-red-600">{errors.permissions.message}</p>
            )}
          </div>
        </div>

        <div className="sm:col-span-6">
          <div className="flex items-center">
            <input
              id="isActive"
              type="checkbox"
              {...register('isActive')}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
              Kullanıcı aktif
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          İptal
        </button>
        <button
          type="submit"
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isEditing ? 'Güncelle' : 'Oluştur'}
        </button>
      </div>
    </form>
  );
}
