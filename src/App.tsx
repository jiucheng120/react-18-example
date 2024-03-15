import { useRoutes } from 'react-router-dom';
import router from './router';

function App() {
  const ourlet = useRoutes(router);

  // 类似于vue中的router-view
  return (
    <div className="App" style={{ height: '100%' }}>
      {ourlet}
    </div>
  );
}

export default App;
