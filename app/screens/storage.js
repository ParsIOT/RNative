import {AsyncStorage} from 'react-native'
import Storage from 'react-native-storage'

const storage = new Storage({
    size:20,
    storageBackend: AsyncStorage,
    defaultExpires: null,
    enableCache: true,
    
})

export default storage