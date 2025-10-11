import sharedChildrens from "./sharedChildrens";
import UserProfile from "../pages/user/Profile/Profile";
import UserManagement from "../pages/admin/UserManagement/UserManagement";
import LawyerRequests from "../pages/admin/LawyerRequests/LawyerRequests";
import ContactSubmissions from "../pages/admin/ContactSubmissions/ContactSubmissions";
import CreateAdmin from "../pages/admin/CreateAdmin/CreateAdmin";
import Dashboard from "../pages/admin/Dashboard/Dashboard";
import LawyerProfileReview from "../pages/admin/LawyerProfileReview/LawyerProfileReview";
import SubmissionDetails from "../pages/admin/SubmissionDetails/SubmissionDetails";

const adminChildrens = [
    {
        path: "/admin",
        element: <Dashboard />
    },
    {
        path: "user-management",
        element: <UserManagement />
    },
    {
        path: "lawyers",
        element: <LawyerRequests />
    },
    {
        path: "lawyer/profile/:lawyerId",
        element: <LawyerProfileReview />
    },
    {
        path: "create-admin",
        element: <CreateAdmin />
    },
    {
        path: "contact-submissions",
        element: <ContactSubmissions />
    },
    {
        path: "contact-submission-details/:contactId",
        element: <SubmissionDetails />
    },
    {
        path: "profile",
        element: <UserProfile />
    },
    ...sharedChildrens
];

export default adminChildrens;