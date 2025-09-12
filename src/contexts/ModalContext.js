// src/contexts/ModalContext.js

import React, { createContext, useState, useContext, useCallback } from 'react';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const openModal = useCallback((content) => {
    // Save current scroll position before opening modal
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    document.body.setAttribute('data-scroll-position', scrollPosition);
    
    setModalContent(content);
    setShowModal(true);
    
    // Add these classes to properly lock scrolling
    document.documentElement.classList.add('modal-open');
    document.body.classList.add('modal-open');
    
    // Fix position to prevent jumping
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
  }, []);

  const closeModal = useCallback((callback) => {
    setShowModal(false);
    
    // Remove the classes after animation completes
    setTimeout(() => {
      document.documentElement.classList.remove('modal-open');
      document.body.classList.remove('modal-open');
      
      // Restore scroll position
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      
      const scrollPosition = parseInt(document.body.getAttribute('data-scroll-position') || '0');
      window.scrollTo(0, scrollPosition);
      
      setModalContent(null);
      
      // Optional callback
      if (callback && typeof callback === 'function') {
        callback();
      }
    }, 300);
  }, []);

  const value = {
    showModal,
    modalContent,
    openModal,
    closeModal,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalContext;