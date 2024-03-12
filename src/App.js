import { Switch, Route, Redirect } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import MakeTable from "./pages/MakeTable";
import ModelTable from "./pages/ModelTable";
import Billing from "./pages/Billing";
import Rtl from "./pages/Rtl";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Main from "./components/layout/Main";
import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import UserProvider from "./context/UserContext";
import ProtectedRoute from "./utils/ProtectedRoute";
import ViewUser from "./pages/Users/ViewUser";
import AddUser from "./pages/Users/AddUser";
import AddInventory from "./pages/Inventory/AddInventory";
import ViewInventory from "./pages/Inventory/ViewInventory";
import ViewRole from "./pages/Roles/ViewRole";
import AddRole from "./pages/Roles/AddRole";
import ViewMake from "./pages/Make/ViewMake";
import AddMake from "./pages/Make/AddMake";
import NotFoundPage from "./pages/Error/NotFoundPage";
import UnAuthorized from "./pages/Error/UnAuthorized";
import ViewModel from "./pages/Model/ViewModel";
import AddModel from "./pages/Model/AddModel";
// import Home from './Components/survey/Home'
// import auth from './apis/survey/authService'
import EditForm from './components/survey/Form/EditForm'
import Login from './components/survey/Login'
// import PrivateRoute from './Components/survey/util/PrivateRoute'
import UserView from './components/survey/Responding/UserView'
import RadioCheck from './components/survey/Responding/RadioCheck'
import FormDashboard from './components/survey/Dashboard'
import Cookies from "universal-cookie";
import Permission from "./utils/Permissions";

function App() {
  //get user from cookies and check if user is admin and give routes based on that
  const cookies = new Cookies();
  const user = cookies.get('user');
  const username = user?.username;
  console.log("username", user);
  console.log("username", username);


  return (
    <div className="App">
      <UserProvider>
        <Switch>
          <Route exact path="/shared-form/:formId" component={UserView} />
          <Route path="/sign-in" component={SignIn} />
          <Main>
            <Switch>
              <Redirect exact from="/" to="/dashboard" />
              {/* <Redirect exact from="/" to="/users" />
          <Redirect exact from="/dashboard" to="/users" /> */}

              {/* <Route exact path="/" component={Home}/>  */}
              <ProtectedRoute exact path="/forms" component={FormDashboard} page={"Surveys"} permissionType={'view'} allowedRoles={Permission.Forms.canView} />
              {/* <ProtectedRoute exact path="/login" component={Login} page={"Surveys"} permissionType={'view'}/> */}
              <ProtectedRoute exact path="/edit-form/:formId" component={EditForm} page={"Surveys"} permissionType={'edit'} allowedRoles={Permission.Forms.canEdit} />
              {/* <Route exact path="/" component={RadioCheck} /> */}
              <ProtectedRoute exact path="/dashboard" Component={Dashboard} page={"Dashboard"} permissionType={'view'} allowedRoles={Permission.Forms.canView} />

              <ProtectedRoute exact path="/users" Component={ViewUser} page={"Users"} permissionType={'view'} allowedRoles={Permission.Users.canView} />
              <ProtectedRoute exact path="/add-user" Component={AddUser} page={"Users"} isEditable={false} permissionType={'add'} allowedRoles={Permission.Users.canAdd} />
              <ProtectedRoute exact path="/edit-user/:applicationUserId" page={"Users"} Component={AddUser} isEditable={true} permissionType={'edit'} allowedRoles={Permission.Users.canEdit}/>

              {/* <ProtectedRoute exact path="/users" Component={ViewUser} /> */}
              {/* <ProtectedRoute exact path="/Adduser" Component={AddUser} /> */}

              <ProtectedRoute exact path="/inventories" Component={ViewInventory} page={"Inventories"} permissionType={'view'} allowedRoles={Permission.Inventories.canView} />
              <ProtectedRoute exact path="/add-inventory" Component={AddInventory} page={"Inventories"} permissionType={'add'} allowedRoles={Permission.Inventories.canAdd} />
              <ProtectedRoute exact path="/edit-inventory/:inventoryId" page={"Inventories"} Component={AddInventory} isEditable={true} permissionType={'edit'} allowedRoles={Permission.Inventories.canEdit} />

              {/* <ProtectedRoute exact path="/makes" Component={ViewMake} page={"Makes"} permissionType={'view'}/>
            <ProtectedRoute exact path="/add-make" Component={AddMake} page={"Makes"} permissionType={'add'}/>
            <ProtectedRoute exact path="/edit-make/:makeId" Component={AddMake} page={"Makes"} isEditable={true} permissionType={'edit'}/>

            <ProtectedRoute exact path="/models" Component={ViewModel} page={"Models"} permissionType={'view'}/>
            <ProtectedRoute exact path="/add-model" Component={AddModel} page={"Models"} permissionType={'add'}/>
            <ProtectedRoute exact path="/edit-model/:modelId" Component={AddModel} page={"Models"} isEditable={true} permissionType={'edit'}/> */}

              {/* <ProtectedRoute exact path="/not-found-page" Component={NotFoundPage} /> */}
              <Route exact path="/un-authorized" Component={UnAuthorized} />
              <Route component={NotFoundPage} />
            </Switch>
              <Route exact path="/un-authorized" Component={UnAuthorized} />

            {/* <ProtectedRoute exact path="/un-authorized" Component={UnAuthorized} /> */}
          </Main>
          
          {/* <ProtectedRoute exact path="/un-authorized" Component={UnAuthorized} /> */}
          <Route component={NotFoundPage} />
        </Switch>
      </UserProvider>
    </div>
  );
}

export default App;
