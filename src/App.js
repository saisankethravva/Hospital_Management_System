import React, { useState, useEffect } from 'react';
import './App.css';
import { Hub } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { HashRouter as Router, Switch, Route, useHistory } from 'react-router-dom';
import SideNav from './components/SideNav';
import Doctor from './pages/Doctor';
import Patient from './pages/Patient';
import ParsePrescription from './pages/ParsePrescription';
import CreateDoctor from './pages/CreateDoctor';
import CreatePatient from './pages/CreatePatient';
import Service from './pages/Service';
import * as User from './components/User';
import ListDoctor from './pages/Admin/ListDoctor';
import ListPatient from './pages/Admin/ListPatient';
// see https://docs.amplify.aws/lib/storage/configureaccess/q/platform/js/


function App() {

  const listener = (data) => {
    switch (data.payload.event) {
      case 'signIn':
        console.info('user signed in', userInfo);
        break;
      case 'signOut':
        console.info('user signed out');
        //history.push('/');
        window.location = '/';
        break;
      case 'signIn_failure':
        console.error('user sign in failed');
        break;
      case 'configured':
        console.info('the Auth module is configured');
        break;
      default:
        console.error('unknown event: ', data.payload.event);
    }
  }
  Hub.listen('auth', listener);

  const [userInfo, setUserInfo] = useState("");

  useEffect(() => {
    User.userInfo().then(str => setUserInfo(str));
  }, []);


  if(userInfo[0] == "Admin")
  {
    return (
      <div className="App">
            <Router>
              <SideNav />
              <Switch>
              {/* Admin Routes */}
              <Route path='/listdoctor' component={ListDoctor} />
              <Route path="/listpatient" component={ListPatient} />
              </Switch>
            </Router>
        <hr />
        <>
          <div className="badge">{userInfo[0]}</div>
        </>
      </div>
    );
  } else if(userInfo[0] == "Doctor")
  {
   return( <div className="App">
            <Router>
              <SideNav />
              <Switch>
              <Route path='/' exact component={Doctor} />
                <Route path='/createdoctor' component={CreateDoctor} />
                <Route path="/prescription" component={ParsePrescription} />
              </Switch>
            </Router>
        <hr />
        <>
    <div className="badge">{userInfo[0]}</div>
        </>
      </div>
   )
  }else{
    return(
      <div className="App">
            <Router>
              <SideNav />
              <Switch>
                <Route path='/patient' component={Patient} />
                <Route path="/prescription" component={ParsePrescription} />
                <Route path='/createpatient' component={CreatePatient} />
              </Switch>
            </Router>
        <hr />
        <>
            <div className="badge">{userInfo[0]}</div>
        </>
      </div>
    )
  }
  
}

export default withAuthenticator(App);
