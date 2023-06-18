import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";


const RouteGuard = ({ children }) => {

    let user = useSelector((state)=> state.user)
    
    if (!user.authDetails) {
        return <Navigate to="/" />;
    }

    return children;

}

export default RouteGuard;