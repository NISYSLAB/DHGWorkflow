import React from 'react';
import './header.css';

const Hsep = () => <div className="hsep sep" />;

const Header = ({ title }) => (
    <header className="header">
        <section className="titlebar">
            {title}
            - LoopSim Editor
        </section>
        <section className="toolbar" />
        <Hsep />
    </header>

);

export default Header;
