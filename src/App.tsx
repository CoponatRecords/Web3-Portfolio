import './App.css'; // Import the CSS file
import {CointousdChartContainer} from '../components/CointousdChartContainer';
import {store} from '../redux/store';
import { Provider } from 'react-redux';

const App = () => {

  return (

    <Provider store={store}>

    <CointousdChartContainer/>
    </Provider>
  );
};

export default App;
