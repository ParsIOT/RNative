import React from 'react'
import {TabNavigator} from 'react-navigation'
import track from '../screens/track'
import learn from '../screens/learn-page'
import beacon from '../screens/beacons-page'

export const Tabs = TabNavigator({
    track:{screen:track},
    learn:{screen:learn},
    // beacon:{screen:beacon}

}
,
{swipeEnabled:false}
)