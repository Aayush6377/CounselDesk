import sharedChildrens from "./sharedChildrens";
import Dashboard from "../pages/lawyer/Dashboard/Dashboard";

const lawyerChildrens = [
    {
        path: "/user-lawyer",
        element: <Dashboard />
    },
    {
        path: "availability"
    },
    {
        path: "appointments"
    },
    {
        path: "earnings"
    },
    ...sharedChildrens
];

export default lawyerChildrens;