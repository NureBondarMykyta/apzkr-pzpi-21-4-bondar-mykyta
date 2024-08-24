import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/LanguageSwitcher.css';


const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="language-switcher">
            <button className={`language-btn ${i18n.language === 'en' ? 'active' : ''}`} onClick={() => changeLanguage('en')}>EN</button>
            <button className={`language-btn ${i18n.language === 'uk' ? 'active' : ''}`} onClick={() => changeLanguage('uk')}>УКР</button>
        </div>
    );
};

export default LanguageSwitcher;
