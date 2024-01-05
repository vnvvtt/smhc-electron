import Dashboard from "views/Dashboard.js";
import Notifications from "views/Notifications.js";
import Icons from "views/Icons.js";
import Typography from "views/Typography.js";
import TableList from "views/Tables.js";
import UserPage from "views/User.js";
import PrescriptionPDF from 'components/Prescription/PrescriptionPDF';
import SpeechToText from 'components/Misc/SpeechToText';
import UserDashboard from 'views/UserDashboard';
import EditPatient from 'components/Patients/EditPatient';
// import AddNewPatient from 'components/Patients/AddNewPatient';
import AddNewBill from 'components/billing/AddNewBill';
import Tables from 'views/Tables';
import GenerateBill from 'components/billing/GenerateBill';
import AddNewExpense from 'components/expenses/AddNewExpense';
import AddLabTypeCategory from 'components/Misc/AddLabTypeCategory';
import RegisterUser from 'components/user/RegisterUser';
import ViewExpenseData from 'components/expenses/ViewExpenseData';
import DisplayBillsList from 'components/billing/DisplayBillsList';
import DisplayExpensesList from 'components/expenses/DisplayExpensesList';

var routes = [
  {
    path: "/userdashboard",
    name: "Billing Dashboard",
    icon: "nc-icon nc-bank",
    component: <UserDashboard />,
    layout: "/admin",
    showInSidebar: true,
    allowedRoles: ["user", "admin"],
  },
  {
    path: "/addnewbill",
    name: "Add New Bill",
    icon: "nc-icon nc-diamond",
    component: <AddNewBill />,
    layout: "/admin",
    showInSidebar: true,
    allowedRoles: ["admin", "user"],
  },
  {
    path: "/addnewexpense",
    name: "Add Expenses",
    icon: "nc-icon nc-bell-55",
    component: <AddNewExpense />,
    layout: "/admin",
    showInSidebar: true,
    allowedRoles: ["user", "admin"],
  },
  {
    path: "/listbills",
    name: "Display Bills List",
    icon: "nc-icon nc-bell-55",
    component: <DisplayBillsList />,
    layout: "/admin",
    showInSidebar: true,
    allowedRoles: ["admin", "user"],
  },
  {
    path: "/listexpenses",
    name: "Display Expenses List",
    icon: "nc-icon nc-bell-55",
    component: <DisplayExpensesList />,
    layout: "/admin",
    showInSidebar: true,
    allowedRoles: ["admin", "user"],
  },
  {
    path: "/newctaegory",
    name: "Add Lab Category",
    icon: "nc-icon nc-bell-55",
    component: <AddLabTypeCategory />,
    layout: "/admin",
    showInSidebar: true,
    allowedRoles: ["admin"],
  },
  {
    path: "/typography",
    name: "Add Expense Category",
    icon: "nc-icon nc-bell-55",
    component: <Notifications />,
    layout: "/admin",
    showInSidebar: true,
    allowedRoles: ["admin"],
  },
  {
    path: "/dashboard",
    name: "Doctor Dashboard",
    icon: "nc-icon nc-bank",
    component: <Dashboard />,
    layout: "/admin",
    showInSidebar: false,
    allowedRoles: ["doctor", "admin"],
  },
  {
    path: "/notifications",
    name: "Appointments",
    icon: "nc-icon nc-bell-55",
    component: <Notifications />,
    layout: "/admin",
    showInSidebar: false,
    allowedRoles: ["doctor", "nurse", "admin"],
  },
  {
    path: "/user-page/:patientId",
    name: "Patient Details",
    icon: "nc-icon nc-single-02",
    component: <UserPage />,
    layout: "/admin",
    showInSidebar: false,
    allowedRoles: ["doctor", "nurse", "admin"],
  },
  {
    path: "/editpatient/:patientId",
    name: "Edit Patient",
    icon: "nc-icon nc-single-02",
    component: <EditPatient />,
    layout: "/admin",
    showInSidebar: false,
    allowedRoles: ["doctor", "nurse", "admin"],
  },
  {
    path: "/newuser",
    name: "Register User",
    icon: "nc-icon nc-tile-56",
    component: <RegisterUser />,
    layout: "/admin",
    showInSidebar: true,
    allowedRoles: ["admin"],
  },
  {
    path: "/typography",
    name: "Miscellaneous",
    icon: "nc-icon nc-caps-small",
    component: <Typography />,
    layout: "/admin",
    showInSidebar: false,
    allowedRoles: ["user", "admin"],
  },
  {
    path: "/speechtotext",
    name: "Speech To Text",
    icon: "nc-icon nc-caps-small",
    component: <SpeechToText />,
    layout: "/admin",
    showInSidebar: false,
    allowedRoles: ["admin"],
  },
  {
    path: "/generatepdf/:prescriptionId/:patientId",
    name: "Generate PDF",
    icon: "nc-icon nc-caps-small",
    component: <PrescriptionPDF />,
    layout: "/admin",
    showInSidebar: false,
    allowedRoles: ["doctor", "nurse", "admin"],
  },
  {
    path: "/generatebill/:billId",
    name: "Generate Bill",
    icon: "nc-icon nc-single-02",
    component: <GenerateBill />,
    layout: "/admin",
    showInSidebar: false,
    allowedRoles: ["user", "admin"],
  },
  {
    path: "/viewexpense/:expenseId",
    name: "View Expense Data",
    icon: "nc-icon nc-single-02",
    component: <ViewExpenseData />,
    layout: "/admin",
    showInSidebar: false,
    allowedRoles: ["user", "admin"],
  },
  {
    name: "Logout",
    icon: "nc-icon nc-button-power", // Choose an appropriate icon for logout
    action: "logout", // Special flag to indicate logout action
  },
];
export default routes;
