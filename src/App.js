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


function App() {
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
            <Route exact path="/forms" component={FormDashboard}/>
            <Route exact path="/login" component={Login}/>
            <Route path="/edit-form/:formId" component={EditForm}/>
            {/* <Route exact path="/fuck" component={RadioCheck} /> */}
            <ProtectedRoute exact path="/dashboard" Component={Dashboard} />

            <ProtectedRoute exact path="/users" Component={ViewUser} page={"Users"} permissionType={'view'}/>
            <ProtectedRoute exact path="/add-user" Component={AddUser} page={"Users"} isEditable={false} permissionType={'add'}/>
            {/* <ProtectedRoute exact path="/users" Component={ViewUser} /> */}
            {/* <ProtectedRoute exact path="/Adduser" Component={AddUser} /> */}
            <ProtectedRoute exact path="/edit-user/:applicationUserId" page={"Users"}  Component={AddUser} isEditable={true} permissionType={'edit'}/>

            <ProtectedRoute exact path="/roles" Component={ViewRole} page={"Roles"} permissionType={'view'}/>
            <ProtectedRoute exact path="/add-role" Component={AddRole} page={"Roles"} permissionType={'add'}/>
            <ProtectedRoute exact path="/edit-role/:applicationRoleId" page={"Roles"}  Component={AddRole} isEditable={true} permissionType={'edit'}/>

  

            {/* <ProtectedRoute exact path="/makes" Component={ViewMake} page={"Makes"} permissionType={'view'}/>
            <ProtectedRoute exact path="/add-make" Component={AddMake} page={"Makes"} permissionType={'add'}/>
            <ProtectedRoute exact path="/edit-make/:makeId" Component={AddMake} page={"Makes"} isEditable={true} permissionType={'edit'}/>

            <ProtectedRoute exact path="/models" Component={ViewModel} page={"Models"} permissionType={'view'}/>
            <ProtectedRoute exact path="/add-model" Component={AddModel} page={"Models"} permissionType={'add'}/>
            <ProtectedRoute exact path="/edit-model/:modelId" Component={AddModel} page={"Models"} isEditable={true} permissionType={'edit'}/> */}

            <ProtectedRoute exact path="/not-found-page" Component={NotFoundPage} />
            <ProtectedRoute exact path="/un-authorized" Component={UnAuthorized} />
            <Route component={NotFoundPage} />
            </Switch>
          </Main>
            <Route component={NotFoundPage} />
        </Switch>
      </UserProvider>
    </div>
  );
}

export default App;
