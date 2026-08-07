import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store/store.js";
// User Pages
import Main from "./pages/user/Main.jsx";
import Home from "./pages/user/Home.jsx";
import Login from "./pages/user/Login.jsx";
import UserBooks from "./pages/user/UserBooks.jsx";
import NewBooks from "./pages/user/NewBooks.jsx";
import UserHistory from "./pages/user/UserHistory.jsx";
import UserProfile from "./pages/user/UserProfile.jsx";
import RagChat from "./pages/user/RagChat.jsx";
// Dashboard Pages
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import AddBook from "./pages/dashboard/AddBook.jsx";
import AddMember from "./pages/dashboard/AddMember.jsx";
import UpdateBook from "./pages/dashboard/updateBook.jsx";
import Books from "./pages/dashboard/Books.jsx";
import Members from "./pages/dashboard/Members.jsx";
import Reports from "./pages/dashboard/Reports.jsx";
import ReturnBook from "./pages/dashboard/ReturnBook.jsx";
import History from "./pages/dashboard/History.jsx";
import Staff from "./pages/dashboard/Staff.jsx";
import DashboardLayouts from "./pages/dashboard/DashboardLayouts.jsx";


import UserAuthCheck from './middleware/UserAuthCheck.jsx'
import AdminAuthCheck from "./middleware/AdminAuthCheck.jsx";
const router = createBrowserRouter([
  
  // 🔥 MAIN LANDING PAGE
  {
    path: "/",
    element: <Main />,
  },
  {
        path: "/login",
        element: <Login />,
  },

  // 🔥 USER (STUDENT) SECTION
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "home",
        element: 
        <UserAuthCheck>
          <Home />
        </UserAuthCheck>
        ,
      },
      {
          path: "chat",
        element: 
        <UserAuthCheck>
          <RagChat />
        </UserAuthCheck>
      },
      
      {
        path: "books",
        element: <UserAuthCheck><UserBooks /></UserAuthCheck>,
      },
      {
        path: "my-books",
        element: <UserAuthCheck><NewBooks /></UserAuthCheck>,
      },
      {
        path: "history",
        element: <UserAuthCheck><UserHistory /></UserAuthCheck>,
      },
      {
        path:"profile",
        element:
        <UserAuthCheck><UserProfile/></UserAuthCheck>,
        
      }
    ],
  },

  // 🔥 ADMIN DASHBOARD
  {
    path: "/dashboard",
    element: 
    <AdminAuthCheck>
       <DashboardLayouts />
    </AdminAuthCheck>
   ,
    children: [
      {
        index: true, // default /dashboard
        element: <Dashboard />,
      },
      {
        path: "add-member",
        element: <AddMember />,
      },
      {
        path: "members",
        element: <Members />,
      },
      {
        path:"staff",
        element:<Staff/>
      },
      {
        path: "add-book",
        element: <AddBook />,
      },
      {
        path:"update-book/:isbn",
        element:<UpdateBook/>

      },
      {
        path: "books",
        element: <Books />,
      },
      {
        path: "reports",
        element: <Reports />,
      },
      {
        path: "history",
        element: <History />,
      },
      {
        path: "return",
        element: <ReturnBook />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
    
  </StrictMode>
);