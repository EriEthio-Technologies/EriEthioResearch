interface UserRowProps {
  user: {
    id: string;
    email: string;
    role: string;
  };
  onDelete?: (id: string) => void;
}

export const UserRow = ({ user, onDelete }: UserRowProps) => (
  <div className="flex items-center justify-between p-4 border-b border-gray-800">
    <div>
      <h3 className="text-neon-cyan">{user.email}</h3>
      <p className="text-gray-400">{user.role}</p>
    </div>
    {onDelete && (
      <button 
        onClick={() => onDelete(user.id)}
        className="text-red-500 hover:text-red-400"
      >
        Delete
      </button>
    )}
  </div>
); 