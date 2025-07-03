import { useSelector } from "react-redux";

function NotFound() {

  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  console.log(user);
  console.log(isAuthenticated);
  
  
  return (<div>

    <h1>page not exist</h1>
  </div>
  );
}

export default NotFound;