import React from 'react';
import {Link, withRouter, useHistory} from 'react-router-dom';
import auth0Client from '../Auth';
import Button from '@material-ui/core/Button';
import '../Navbar.scss';

function NavBar(props) {
    const signOut = () => {
        auth0Client.signOut();
        props.history.replace('/');
    };

    const history = useHistory();

    return(
        <nav className="navbar fixed-top">
            <Link className="navbar-brand" to="/">
                Todo List
            </Link>
            {
                !auth0Client.isAuthenticated() &&
                <Button variant="outlined" color="primary" onClick={auth0Client.signIn}>
                    Sign in
                </Button>
            }
            {
                auth0Client.isAuthenticated() &&
                <div>
                    <Button className="navButton" onClick={() => history.push("/calendar")}>Calendar View</Button>
                    <Button className="navButton" onClick={() => history.push("/app")}>Tasks</Button>
                    <Button className="navButton" onClick={() => history.push("/week")}>Week view</Button>
                    {/* <label className="profileName mr-2">{auth0Client.getProfile().name}</label> */}
                    <Button className="navButton">{auth0Client.getProfile().name}</Button>
                    <Button className="navButton" variant="outlined" onClick={() => {signOut()}}>Sign Out</Button>
                </div>
            }
        </nav>
    );
}

export default withRouter(NavBar);