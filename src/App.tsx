import './App.css'; // Import the CSS file
import {store} from '../redux/store';
import { Provider } from 'react-redux';
import CointousdChartContainer from '../components/CointousdChartContainer'
const App = () => {

  return (

    <Provider store={store}>

    <CointousdChartContainer/>
    </Provider>
  );
};

export default App;
