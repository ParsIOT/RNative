import React from 'react'
import {TabNavigator} from 'react-navigation'
import track from '../screens/track'
import learn from '../screens/learn-page'
import map from '../screens/map'

export const Tabs = TabNavigator({
    track:{screen:track},
    learn:{screen:learn},
    map:{screen:map}
}
,
{swipeEnabled:false}
)