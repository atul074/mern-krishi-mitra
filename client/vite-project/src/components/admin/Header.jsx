import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../store/auth-slice";

function AdminHeader({ setOpen }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  return (
    <header className="sticky top-0 flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#2eaf7d] from-10% via-[#65CCB8] via-40% to-[#2eaf7d] to-90% border-b border-gray-300">
      {/* Left Section - Menu Toggle and User Name */}
      <div className="flex items-center gap-4">
        {/* Menu Toggle Button */}
        <button
          onClick={() => setOpen(true)}
          className="lg:hidden sm:block p-2 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-md"
          aria-label="Toggle Menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 5.25h16.5m-16.5 6h16.5m-16.5 6h16.5"
            />
          </svg>
        </button>

        {/* User Name */}
        {user && (
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#02353c] flex items-center justify-center text-white font-semibold">
              {user.userName.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium text-gray-800">{user.userName}</span>
          </div>
        )}
      </div>

      {/* Right Section - Logout Button */}
      <div className="flex items-center">
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#02353c] hover:bg-white hover:text-[#02353c] text-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-9A2.25 2.25 0 002.25 5.25v13.5A2.25 2.25 0 004.5 21h9a2.25 2.25 0 002.25-2.25V15m3-3h-8.25m0 0l3-3m-3 3l3 3"
            />
          </svg>
          Logout
        </button>
      </div>
    </header>
  );
}

export default AdminHeader;