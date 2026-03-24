import './App.scss';
// components
import AppHeader from './components/AppHeader/AppHeader';
import AppDisplay from './components/AppDisplay/AppDisplay';

function App() {

  return (
      <div className="App">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI=" crossOrigin="" />
        <AppHeader />
        <AppDisplay />
      </div>
  );
}

export default App;

