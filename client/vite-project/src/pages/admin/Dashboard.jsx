import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {fetchAllUsers,} from "../../store/admin/users-slice";

function AdminDashboard() {
  const { userList } = useSelector((state) => state.adminUsers);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

    return (
      <div className="min-h-screen bg-[#65CCB8] p-6">
      <div className="max-w-4xl mx-auto bg-gray-200 shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800 text-center py-4">
          Users List  ({userList.length})
        </h1>
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-400 ">
                <th className="px-4 py-2 border font-bold border-gray-400">Name</th>
                <th className="px-4 py-2 border font-bold border-gray-400">E-mail Id</th>
                <th className="px-4 py-2 border font-bold border-gray-400">Role</th>
              </tr>
            </thead>
            <tbody>
              {userList.map((user) => (
                <tr key={user.id} className="text-center hover:bg-gray-100">
                  <td className="px-4 py-2 border border-gray-300">{user?.userName}</td>
                  <td className="px-4 py-2 border border-gray-300">{user?.email}</td>
                  <td className={`px-4 py-2 border border-gray-300 ${user?.role==="admin"?"text-red-500":""}`}>{user?.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    );

  }
  
  export default AdminDashboard;