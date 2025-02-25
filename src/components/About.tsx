import { FC } from "react";
import "../styles/About.css"; // ייבוא קובץ ה-CSS הייעודי

interface AboutProps {}

const About: FC<AboutProps> = () => {
  return (
    <div className="container-fluid py-5 px-0 about-container">
      <div className="text-center mb-5">
        <h1 className="display-4">About BCard</h1>
      </div>

      <div className="container-fluid px-4">
        <div className="card border-0 shadow-sm w-100">
          <div className="card-body p-md-5">
            <h2 className="mb-4 text-center">Welcome to BCard - Your Digital Business Card Platform</h2>
            <p className="lead text-center">
              BCard is a modern platform for creating, managing, and discovering business cards online. Whether you're a business owner looking to showcase your services or someone searching for businesses to connect with, BCard provides the perfect solution.
            </p>

            <hr className="my-5" />

            <h3 className="h4 mb-4 text-center">What you can do on BCard:</h3>
            
            {/* שימוש במערכת גריד CSS מותאמת אישית */}
            <div className="features-row">
              {features.map(({ icon, title, description, bgColor }, index) => (
                <div key={index} className="feature-item">
                  <div className={`feature-icon icon-bg-${bgColor}`}>
                    <i className={`fa-solid ${icon} fa-xl text-${bgColor}`}></i>
                  </div>
                  <h4 className="h5 mt-3">{title}</h4>
                  <p className="small">{description}</p>
                </div>
              ))}
            </div>

            <h3 className="h4 mb-4 mt-5 text-center">Getting Started:</h3>
            <div className="card mb-5 border-0 w-100">
              <div className="card-body p-4">
                <ol className="mb-0">
                  {gettingStartedSteps.map((step, index) => (
                    <li key={index} className="mb-3">{step}</li>
                  ))}
                </ol>
              </div>
            </div>

            <h3 className="h4 mb-4 text-center">Account Types:</h3>
            <div className="table-responsive mb-5 w-100">
              <table className="table">
                <thead className="table-dark">
                  <tr>
                    <th style={{ width: "25%" }}>Account Type</th>
                    <th>Features</th>
                  </tr>
                </thead>
                <tbody>
                  {accountTypes.map(({ type, features }, index) => (
                    <tr key={index}>
                      <td className="fw-bold">{type}</td>
                      <td>
                        <ul className="mb-0">
                          {features.map((feature, i) => (
                            <li key={i}>{feature}</li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="h4 mb-4 text-center">Contact Us:</h3>
            <div className="text-center mb-5">
              <p>If you have any questions, contact our support team at:</p>
              <a href="mailto:support@bcard.com" className="text-decoration-none">support@bcard.com</a>
              <div className="mt-3">
                <button className="btn btn-primary">
                  <i className="fa-solid fa-envelope me-2"></i>Contact Support
                </button>
              </div>
            </div>

            <hr className="my-5" />
            <div className="text-center">
              <p className="text-muted">&copy; {new Date().getFullYear()} BCard - All rights reserved</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const features = [
  { icon: "fa-search", title: "Discover Businesses", description: "Browse and search through business cards from various industries.", bgColor: "primary" },
  { icon: "fa-heart", title: "Save Favorites", description: "Mark business cards as favorites for quick access later.", bgColor: "danger" },
  { icon: "fa-id-card", title: "Create Your Own Cards", description: "Business users can create their own digital business cards.", bgColor: "success" },
  { icon: "fa-pen-to-square", title: "Manage Your Content", description: "Edit and update your business information anytime.", bgColor: "info" }
];

const gettingStartedSteps = [
  "Create an account by clicking the 'Sign Up' button.",
  "Check the 'Business Account' option if you want to create business cards.",
  "Once registered, you can start browsing cards or create your own.",
  "Use the search feature to find specific businesses or services.",
  "Click the heart icon to add cards to your favorites."
];

const accountTypes = [
  { type: "Regular User", features: ["Browse all business cards", "Save favorites", "Contact businesses"] },
  { type: "Business User", features: ["All regular user features", "Create business cards", "Edit your cards", "Track your business presence"] },
];

export default About;