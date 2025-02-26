import React from 'react';

interface FooterProps {
  userType?: 'guest' | 'user' | 'business' | 'admin';
}

const Footer: React.FC<FooterProps> = ({ userType = 'guest' }) => {
  const footerLinks = {
    guest: [
      { path: '/about', label: 'About' },
      { path: '/login', label: 'Login' },
      { path: '/register', label: 'Register' }
    ],
    user: [
      { path: '/about', label: 'About' },
      { path: '/fav-cards', label: 'Favorite Cards' }
    ],
    business: [
      { path: '/about', label: 'About' },
      { path: '/fav-cards', label: 'Favorite Cards' },
      { path: '/my-cards', label: 'My Cards' },
      { path: '/new-card', label: 'Create Card' }
    ],
    admin: [
      { path: '/about', label: 'About' },
      { path: '/fav-cards', label: 'Favorite Cards' },
      { path: '/my-cards', label: 'My Cards' },
      { path: '/sandbox', label: 'Admin Panel' }
    ]
  };

  return (
    <footer className="footer mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-12 text-center">
            <div className="footer-links">
              {footerLinks[userType].map((link) => (
                <a 
                  key={link.path} 
                  href={link.path} 
                  className="btn btn-link text-muted mx-2"
                >
                  <span className='footer-dark'>{link.label}</span>
                </a>
              ))}
            </div>
            <div className="footer-copyright mt-3 text-muted">
              <small className="footer-dark">
                &copy; {new Date().getFullYear()} BCard - All Rights Reserved
              </small>
            </div>
            <div className="footer-social mt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted mx-2">
                <i className="fab fa-facebook-f footer-dark"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted mx-2">
                <i className="fab fa-twitter footer-dark"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted mx-2">
                <i className="fab fa-linkedin-in footer-dark"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;