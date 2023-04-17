import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="body text-dark color-primary-0">
        <header className="container-fluid">
            <nav className="navbar navbar-expand-sm navbar-dark color-primary-0">
                <a className="navbar-brand" href="index.html">Study Buddy</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav">
                        <li className="nav-item active">
                            <a className="nav-link active" href="index.html">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="learn.html">Learn</a>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
        <footer className="bg-dark text-dark text-muted">
            <div className="container-fluid">
                <span className="text-reset">Author: Josh Ogden</span>
                <a
                        className="text-reset"
                        href="https://github.com/J-Ogden99/startup"
                        target="_blank"
                >GitHub</a
                >
            </div>
        </footer>
    </div>
  );
}

export default App;
