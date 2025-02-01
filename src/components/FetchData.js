import React from 'react';

export default function FetchData  (){
  const [users, setUsers] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    let isMounted = true; 

    async function fetchUsers() {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        if (isMounted) {
          setUsers(data);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setIsLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      isMounted = false; 
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">User List</h1>

      {isLoading && <p className="text-center text-blue-500 animate-pulse">Loading...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {!isLoading && !error && (
        <ul className="divide-y divide-gray-200">
          {users.map(user => (
            <li key={user.id} className="p-4 hover:bg-gray-100 rounded-md transition">
              <p className="text-lg font-medium text-gray-700">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

