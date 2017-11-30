//import Beacon_class from './pages/beacons-page'
import wifi_class from './pages/wifi-page'
import {StackNavigator} from 'react-navigation'

const App = StackNavigator({Home: { screen: wifi_class }});
//,Profile: { screen: wifi_class }
export default App;
//AppRegistry.registerComponent('reactNativeBeaconExample', ()=> Beacon_class);
