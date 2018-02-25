import React from 'react'
import {TabNavigator} from 'react-navigation'
import track from '../screens/trackWifi'
import learn from '../screens/learnWifi'
// import beacon from '../screens/trackWifi'
import TrackBeacons from '../screens/trackBeacon'
import learnBeacon from '../screens/learnBeacon'
import Setting from '../screens/setting.js'

export const Tabs = TabNavigator({
    //track:{screen:track},
    //Wlearn:{screen:learn},
    Tbeacon:{screen:TrackBeacons},
    // Tlearn:{screen:learnBeacon},
    Set : { screen : Setting }

}
,
{swipeEnabled:false,
}
)