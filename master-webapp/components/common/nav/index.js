
/**
* routes  navStore  navigation
*  <>-----}|------------------------------->
* 
*/


import NavStore from "./navStore"

class NavigationHelper {

    constructor(routes) {
        NavStore.setRoutes(routes);
    }

}