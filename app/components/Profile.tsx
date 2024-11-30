import React, { useState } from 'react';
import {
  Avatar,
  TextField,
  IconButton,
  Snackbar,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
}

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [profileImage, setProfileImage] = useState('/default-avatar.png');
  const [profileData, setProfileData] = useState<ProfileData>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 9876543210',
    address: 'Mumbai, India',
    bio: 'Financial enthusiast with a passion for smart investments.',
  });

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setIsEditing(false);
    setShowSnackbar(true);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (field: keyof ProfileData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [field]: event.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100">
      {/* Top Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="bg-white/80 backdrop-blur-lg border-b border-neutral-100">
          <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
            <h1 className="text-xl font-semibold bg-gradient-to-r from-pink-700 to-pink-500 bg-clip-text text-transparent">
              My Profile
            </h1>
            <IconButton 
              onClick={isEditing ? handleSave : handleEdit}
              className={`w-10 h-10 ${isEditing ? 'text-pink-600' : 'text-gray-600'} hover:scale-105 transition-transform`}
            >
              {isEditing ? <SaveIcon /> : <EditIcon />}
            </IconButton>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 pt-24 pb-24">
        {/* Profile Header Section */}
        <div className="relative">
          {/* Background Banner */}
          <div className="h-40 rounded-t-3xl bg-gradient-to-r from-pink-400 to-pink-600"></div>
          
          {/* Profile Image */}
          <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-32 h-32 rounded-full relative overflow-hidden border-4 border-white shadow-xl">
              <Avatar
                src={profileImage}
                sx={{
                  width: '100%',
                  height: '100%',
                }}
              />
              <input
                accept="image/*"
                type="file"
                id="image-upload"
                hidden
                onChange={handleImageUpload}
              />
              <label htmlFor="image-upload">
                <IconButton
                  component="span"
                  className="absolute bottom-0 right-0 bg-white/90 hover:bg-white text-pink-500 hover:text-pink-600 transition-all"
                >
                  <CameraAltIcon />
                </IconButton>
              </label>
            </div>
          </div>

          {/* Profile Info Card */}
          <div className="bg-white rounded-3xl shadow-lg mt-16 p-6">
            {/* Name Section */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-700 to-pink-500 bg-clip-text text-transparent">
                {profileData.name}
              </h2>
              <p className="text-gray-500 mt-2">{profileData.bio}</p>
            </div>

            {/* Quick Info Section */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center space-x-2 text-gray-600">
                <LocationOnIcon className="text-pink-500" />
                <span className="text-sm">{profileData.address}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <EmailIcon className="text-pink-500" />
                <span className="text-sm">{profileData.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <PhoneIcon className="text-pink-500" />
                <span className="text-sm">{profileData.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <PersonIcon className="text-pink-500" />
                <span className="text-sm">Active Member</span>
              </div>
            </div>

            {/* Edit Form */}
            {isEditing && (
              <div className="space-y-6 mt-8 border-t border-pink-100 pt-6">
                {Object.entries(profileData).map(([field, value]) => (
                  <div key={field} className="space-y-2">
                    <label className="text-sm font-medium text-gray-500 capitalize flex items-center space-x-2">
                      {field === 'address' && <LocationOnIcon className="text-pink-400 w-4 h-4" />}
                      {field === 'email' && <EmailIcon className="text-pink-400 w-4 h-4" />}
                      {field === 'phone' && <PhoneIcon className="text-pink-400 w-4 h-4" />}
                      {field === 'name' && <PersonIcon className="text-pink-400 w-4 h-4" />}
                      <span>{field}</span>
                    </label>
                    <TextField
                      fullWidth
                      value={value}
                      onChange={handleChange(field as keyof ProfileData)}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'white',
                          borderRadius: '12px',
                          '&.Mui-focused fieldset': {
                            borderColor: '#EC4899',
                            borderWidth: '2px',
                          },
                          '&:hover fieldset': {
                            borderColor: '#EC4899',
                          },
                          '& fieldset': {
                            borderColor: '#f3f4f6',
                          }
                        },
                        '& .MuiInputBase-input': {
                          padding: '12px 16px',
                        }
                      }}
                      multiline={field === 'bio'}
                      rows={field === 'bio' ? 4 : 1}
                      className="shadow-sm"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        message="Profile updated successfully!"
        sx={{
          '& .MuiSnackbarContent-root': {
            backgroundColor: '#EC4899',
            color: 'white',
          }
        }}
      />
    </div>
  );
}
