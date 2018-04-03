# Fun with Binary
2018

(c) Diogo Cordeiro

This is the README file for Fun with Binary, an app to help introducing students how binary numbers work.

Further information about Fun with Binary can be found in the project home page:

[https://www.diogo.site/projects/fun_with_binary/](https://www.diogo.site/projects/fun_with_binary/)

## Getting Started

Fun with Binary has two different modes:
- Online: Which has a little body to make everything more interactive.
- Offline: Which is more independent and can be used right away without any further technicality by accessing: [https://www.diogo.site/projects/fun_with_binary/offlinev2.html](https://www.diogo.site/projects/fun_with_binary/offlinev2.html)

### Prerequisites

### Offline Mode

There are no special prerequisites for the offline mode.

### Online Mode

At least: Arduino Uno with ESP8266-01, 6 leds (and 6 resistors), wires, breadboard.

Some instruction of how to build it can be found on my blog post about this project: [https://blog.diogo.site/posts/fun-with-binary](https://blog.diogo.site/posts/fun-with-binary)

## Versioning

I use [SemVer](http://semver.org/) for versioning. For the versions available, see the tags on this repository.

## Authors

* **Diogo Cordeiro**

## License

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but
WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public
License along with this program, in the file "COPYING".  If not, see
<http://www.gnu.org/licenses/>.

    IMPORTANT NOTE: The GNU Affero General Public License (AGPL) has
    *different requirements* from the "regular" GPL. In particular, if
    you make modifications to the Fun with Binary source code on your server,
    you *MUST MAKE AVAILABLE* the modified version of the source code
    to your users under the same license. This is a legal requirement
    of using the software, and if you do not wish to share your
    modifications, *YOU MAY NOT INSTALL FUN WITH BINARY*.

Additional library software has been made available. All of it is Free Software
and can be distributed under liberal terms, but those terms may differ in detail
from the AGPL's particulars. See each package's license file in their official
repository for additional terms.

## New this version

This is version 2.0 of Fun with Binary and includes the following (key) changes 
from the previous one:

- Client <-> Server <-> Arduino was replaced by a Client <-> Arduino structure
- ESP8266 is now required for Access Point purposes
- Both modes have become PHP independent (mostly relevant in the offline one)

The last release, 2.0, gave us these improvements:

- Significant visual improvement
- 2 Powers Label switch functionality
- Offline mode is now lighter and more portable (no computer with webserver required anymore)
