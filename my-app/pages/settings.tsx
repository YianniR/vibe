const SettingsPage = () => {
    return (
      <div className="container">
        <div className="navigation">
          <button onClick={() => (window.location.href = '/')} className="nav-button">
            <i className="fas fa-home"></i>
          </button>
        </div>
        <h1>Settings</h1>
      </div>
    );
  };
  
  export default SettingsPage;
  