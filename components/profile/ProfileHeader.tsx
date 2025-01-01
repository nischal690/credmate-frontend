import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import { IconButton } from '@mui/material';

export function ProfileHeader({
  isEditing,
  onEdit,
  onSave,
}: {
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
}) {
  return (
    <div className='fixed top-0 left-0 right-0 z-50'>
      <div className='border-b bg-white/80 backdrop-blur-lg border-neutral-100'>
        <div className='flex items-center justify-between h-16 max-w-md px-4 mx-auto'>
          <h1 className='text-xl font-semibold text-transparent bg-gradient-to-r from-pink-700 to-pink-500 bg-clip-text'>
            My Profile
          </h1>
          <IconButton
            onClick={isEditing ? onSave : onEdit}
            className={`w-10 h-10 ${isEditing ? 'text-pink-600' : 'text-gray-600'} hover:scale-105 transition-transform`}
          >
            {isEditing ? <BookmarkAddedIcon /> : <BookmarkAddIcon />}
          </IconButton>
        </div>
      </div>
    </div>
  );
}
