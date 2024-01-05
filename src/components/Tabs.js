import React, { useState } from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';

const Tabs = ({ children }) => {
    const [activeTab, setActiveTab] = useState(children[0].props.label);

    const handleClick = (newActiveTab) => {
        setActiveTab(newActiveTab);
    };

    return (
        <div className="container">
            <Nav tabs className="border-bottom-0">
                {children.map((child) => (
                    <NavItem key={child.props.label}>
                        <NavLink
                            className={`${activeTab === child.props.label ? 'active' : ''}`}
                            onClick={() => handleClick(child.props.label)}
                            style={{
                                cursor: 'pointer',
                                backgroundColor: activeTab === child.props.label ? 'red' : 'transparent',
                                color: activeTab === child.props.label ? '#fff' : '#000', // Text color for the active tab
                            }}
                        >
                            {child.props.label}
                        </NavLink>
                    </NavItem>
                ))}
            </Nav>
            <TabContent activeTab={activeTab} className="border 4px solid rounded-top">
                {children.map((child) => (
                    <TabPane
                        key={child.props.label}
                        tabId={child.props.label}
                        className={activeTab === child.props.label ? 'bg-red text-white' : ''}
                        style={{ border: "1px solid" }}
                    >
                        {child.props.children}
                    </TabPane>
                ))}
            </TabContent>
        </div>
    );
};

const Tab = ({ label, children }) => {
    return (
        <div label={label}>
            {children}
        </div>
    );
};

export { Tabs, Tab };
