import React from 'react';
import LanguageSwitcher from './LanguageSwitcher';

const Layout = ({ children }) => {
    return (
        <div className="layout-container">
            <header className="header">
                <LanguageSwitcher />
            </header>
            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

export default Layout;
