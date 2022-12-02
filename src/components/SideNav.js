import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import { AmplifySignOut } from '@aws-amplify/ui-react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as GiIcons from "react-icons/gi";
import * as User from './User';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import './SideNav.css'

const SideNav = (props) => {

    const SidebarData = function (isDoctor, isAdmin) {
        return [
            {
                title: 'Doctor',
                path: '/',
                icon: <AiIcons.AiFillHeart />,
                cName: 'nav-text',
                show: isDoctor
            },
            {
                title: 'Patient',
                path: '/patient',
                icon: <GiIcons.GiHealthNormal />,
                cName: 'nav-text',
                show: !isDoctor && !isAdmin
            },
            {
                title: 'List Doctors',
                path: '/listdoctor',
                icon: <FaIcons.FaUserLock />,
                cName: 'nav-text',
                show: isAdmin
            },
            {
                title: 'List Patients',
                path: '/listpatient',
                icon: <AiIcons.AiFillSetting />,
                cName: 'nav-text',
                show: isAdmin
            }
        ]
    };

    const [sidebar, setSidebar] = useState(false);
    const [sidebarData, setSidebarData] = useState(SidebarData());
    const showSidebar = () => setSidebar(!sidebar);
    const history = useHistory();
    let admin;
    let doctor;

    useEffect(() => {
        fetchRoles();
        return onAuthUIStateChange((nextAuthState, authData) => {
            console.log('nextAuthState', nextAuthState, authData);
            if (nextAuthState === 'signedin') {
                if (admin) {
                    history.push('/listdoctor');
                }
                else if (doctor) {
                    history.push('/')
                }
                else {
                    history.push('/patient')
                }
            }
        });
    }, [sidebar]);

    async function fetchRoles() {
        admin = await User.isAdmin();
        doctor = await User.isDoctor();
        const updatedSideBarData = SidebarData(doctor, admin);
        console.log('updatedSideBarData', updatedSideBarData);
        setSidebarData(updatedSideBarData);
    }

    return (
        <>
            <div className='navbar'>
                <Link to='#' className='menu-bars'>
                    <FaIcons.FaBars onClick={showSidebar} />
                </Link>
                <div className='title'>SUNRISE HEALTH CARE </div>
                <div id="LoginSignOut">
                    <AmplifySignOut id="SignOutButton"/>
                </div>
            </div>
            <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                <ul className='nav-menu-items' onClick={showSidebar}>
                    <li className='navbar-toggle'>
                        <Link to='#' className='menu-bars'>
                            <AiIcons.AiOutlineClose />
                        </Link>
                    </li>
                    {sidebarData.map((item, index) => {
                        return (item.show ?
                            <li key={index} className={item.cName}>
                                <Link to={item.path}>
                                    {item.icon}
                                    <span>{item.title}</span>
                                </Link>
                            </li> : ""
                        );
                    })}
                </ul>
            </nav>
        </>
    );
}

export default SideNav;