import React from 'react';
import styles from './App.module.scss';
import './global.scss';
import authService, { PrivateRoute, PublicRoute } from './services/auth';
import {
    HashRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import LandingPage from './pages/Home';
import MainPage from './pages/Main';
import LoginPage from './pages/Login';
import Header from './pages/Header';
import { FeedbackModal } from './components/SendFeedback/FeedbackModal';
import { InviteModal } from './components/Invite/InviteModal';

//components
import Notification from "./components/Notification";

//enhances
import { withScripts, withMessageFunctions } from './App.enhance';

const App = props => {
    const { message, showMessage } = props

    return (
        <div className={styles.container}>
          <Router>
            <Header authService={authService} />

            <Notification type={message.type} message={message.value} shown={message.shown} hiding={message.hiding}/>

            <div className={styles.appContainer}>
              <FeedbackModal />
              <InviteModal />
              <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />
              <Switch>
                <PrivateRoute exact path="/">
                  <MainPage showMessage={showMessage}/>
                </PrivateRoute>
                <PublicRoute path="/login">
                  <LoginPage />
                </PublicRoute>
                <Route path="/get-started">
                  <LandingPage />
                </Route>
              </Switch>
            </div>
          </Router>
        </div>
    );
}

export default withScripts(
    withMessageFunctions(App)
);