import logo from './logo.svg';
import './App.css';
import Header from './components/header';
import LatestComic from './components/comics';
import Footer from './components/footer';

function App() {
  return (
    <div className="App container">
      <Header />
      <LatestComic />
      <Footer />
    </div>
  );
}

export default App;
