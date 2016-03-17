The application store
#####################

The application consists of only one store, *ParkingZoneStore*, this store
connects to the firebase database and mantains it's state in sync with the
data in the database.

The store mantains in it's state the following things:

zones
-----

A list of object literals that functions as maps, containing information
about each of the zones in the database.

places
------

An object literal serving as a map that realtes the different places
names with another object literal containing the zoneID the place belongs to,
aswell as it's category.

setSuggestedZone
----------------

The suggestedZone is an object literal with the information about the zone
deemed optimal by the dispatching algorithm of the application.
