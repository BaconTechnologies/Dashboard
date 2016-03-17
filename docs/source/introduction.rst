Introduction
############

The *Dashboard* is a web application to monitor and manage the Bacon
Technologies parking lot administrator system.

It is build as a single page application using `Facebook's React Framework
<https://facebook.github.io/react/docs/getting-started.html>`_. In addition, the
application uses a `Flux Architecture
<https://facebook.github.io/react/docs/flux-overview.html>`_ which enables it to
operate unding a single flow of information paradigm.

The application works under the assumption that the parking lot will be
logically subdivided into zones. In addition, the application introduces the
concepts of *places*, which are locations associated with exactly one parking
zone, whichever is closest to it. For example, a parking lot make consists of
zones Z1, Z2, Z3 and it may be the case that there are the "Administrative
buildings", "Gimnasium" and "Classroom" places. Where the First two are
associated to the zone Z1 and the reaining with the zone Z3.
