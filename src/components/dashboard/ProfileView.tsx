import React from 'react';

interface ProfileViewProps {
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  onUpdateProfile: (data: { name: string; email: string; phone?: string }) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ name, email, phone, avatarUrl, onUpdateProfile }) => {
  const [formData, setFormData] = React.useState({ name, email, phone: phone || '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">My Profile</h2>
      <div className="flex flex-col items-center mb-6">
        <img
          src={avatarUrl || 'https://via.placeholder.com/100'}
          alt="Avatar"
          className="w-24 h-24 rounded-full object-cover mb-4"
        />
        <p className="text-lg font-medium">{name}</p>
        <p className="text-gray-500">{email}</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileView;
