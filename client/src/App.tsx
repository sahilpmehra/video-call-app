import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import CallScreen from './screens/CallScreen';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/call/:roomId" element={<CallScreen />} />
      </Routes>
    </Router>
  );
};

export default App;