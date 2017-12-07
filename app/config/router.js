import React from 'react'
import {TabNavigator} from 'react-navigation'
import track from '../screens/track'
import learn from '../screens/learn-page'

export const Tabs = TabNavigator({
    track:{screen:track},
    learn:{screen:learn}
})