import { StackNavigator } from 'react-navigation';
import AppRegistry from 'react-native'
import Beacons from './pages/beacons-page'
import Wifis from './pages/wifi-page'


const RootNavigator = StackNavigator({
    
        Home:{screen:Wifis},
        Profile:{screen:Beacons}
    
    });

    export default RootNavigator;