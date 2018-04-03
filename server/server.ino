/**
 * Fun with Binary - a fun way of introducing binary
 * Copyright (C) 2018, Diogo Cordeiro.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @category  Server Core
 * @package   Fun with Binary
 * @author    Diogo Cordeiro <up201705417@fc.up.pt>
 * @copyright 2018 Diogo Cordeiro.
 * @license   http://www.fsf.org/licensing/licenses/agpl-3.0.html GNU Affero General Public License version 3.0
 * @link      https://www.diogo.site/projects/fun_with_binary/
 */

#include <ESP8266WiFi.h>
#include <DNSServer.h>
#include <ESP8266WebServer.h>

// Pages
#include "file1.h"

// Define a dns server for Captive Portal
const byte DNS_PORT = 53;
DNSServer dnsServer;

IPAddress apIP(42, 42, 42, 42); // Defining a static IP address: local & gateway
                                // Default IP in AP mode is 192.168.4.1
IPAddress netMsk(255, 255, 255, 0);

// These are the WiFi access point settings. Update them to your liking
const char *ssid = "Fun with Binary";
//const char *password = "";

// Define a web server at port 80 for HTTP
ESP8266WebServer webServer(80);

// Number of leds
#define NLEDS 6

// LEDs board outputs
int bits[NLEDS] = { D0, D1, D2, D3, D4, D5 };

// Memorizes bits state
int current_answer[NLEDS] = { 0 };

/**
 * Turns all leds on
 * **Doesn't update current_answer**
 */
void
turn_all_on()
{
        for (int i = 0; i < NLEDS; ++i)
        {
                digitalWrite(bits[i], HIGH);
        }
}

/**
 * Turns all leds off
 * **Doesn't update current_answer**
 */
void
turn_all_off()
{
        for (int i = 0; i < NLEDS; ++i)
        {
                digitalWrite(bits[i], LOW);
        }
}

/**
 * App endpoint
 */
void
handleRoot()
{

        webServer.send(200, "text/html", file1);
}

/**
 * 404 - Page Not Found endpoint
 */
void
handleNotFound()
{
        String message = "File Not Found\n\n";
        message += "URI: ";
        message += webServer.uri();
        message += "\nMethod: ";
        message +=(webServer.method() == HTTP_GET) ? "GET" : "POST";
        message += "\nArguments: ";
        message += webServer.args();
        message += "\n";

        for (uint8_t i = 0; i < webServer.args(); ++i) {
                message +=
                    " " + webServer.argName(i) + ": " + webServer.arg(i) +
                    "\n";
        }

        webServer.send(404, "text/plain", message);
}

/**
 * Let the user know when an invalid input is attempted. When this function
 * is called it actually is a good sign because although we return a 500 HTTP
 * Status Code we have in fact controlled the invalid input internal error.
 *
 * This kind of errors shall not happen during regular usage of our App.
 * If this is thrown it probably was due to someone messing with our API.
 */
void
handleInputError()
{
        String message = "Invalid Input - Internal Error Controlled\n\n";
        message += "URI: ";
        message += webServer.uri();
        message += "\nMethod: ";
        message +=(webServer.method() == HTTP_GET) ? "GET" : "POST";
        message += "\nArguments: ";
        message += webServer.args();
        message += "\n";

        for (uint8_t i = 0; i < webServer.args(); ++i)
        {
                message +=
                    " " + webServer.argName(i) + ": " + webServer.arg(i) +
                    "\n";
        }

        webServer.send(500, "text/plain", message);
}

/**
 * Switches a led state (a.k.a. bit of current answer)
 *
 * **Updates current_answer**
 */
void
switch_led()
{
        int incomingByte = webServer.arg("led").toInt();

        // Validate input
        if (incomingByte >= NLEDS || incomingByte < 0)
        {
                handleInputError();
                return;
        }

        if (current_answer[incomingByte] == 1)
        {                       // Turn LED off
                digitalWrite(bits[incomingByte], LOW);
                current_answer[incomingByte] = 0;
        }
        else
        {                       // Turn LED on
                digitalWrite(bits[incomingByte], HIGH);
                current_answer[incomingByte] = 1;
        }

        webServer.send(200, "text/plain", "ok");
}

/**
 * Allows the printing of a binary string in our "led display"
 *
 * **Doesn't update current_answer**
 */
void
print_binary_string(String which)
{
        for (int i = 0; i < NLEDS; ++i)
        {
                if (which.charAt(i) == '1')
                {
                        digitalWrite(bits[i], HIGH);
                }
                else
                {
                        digitalWrite(bits[i], LOW);
                }
        }
}

/**
 * Resets for a potential new game
 */
void
reset_game()
{
        turn_all_off();
        // Reset current_answer
        for (int i = 0; i < NLEDS; ++i)
        {
                current_answer[i] = 0;
        }
}

/**
 * Blinks current_answer for 3 seconds (3 times) and resets the game
 */
void
won_game()
{
        for (int i = 0; i < 3; ++i)
        {
                turn_all_off();

                delay(500);

                print_binary_string(current_answer);

                delay(500);
        }

        reset_game();
}

/**
 * The setup routine runs once when you press reset.
 */
void
setup()
{
        // initialize the digital pins as an output.
        for (int i = 0; i < NLEDS; ++i)
        {
                pinMode(bits[i], OUTPUT);
        }

        Serial.begin(115200);
        Serial.println();
        Serial.println("Configuring access point...");

        // Set WiFi mode to Access Point, you can also add Station mode
        WiFi.mode(WIFI_AP);    //_STA);
        // set-up the custom IP address
        WiFi.softAPConfig(apIP, apIP, IPAddress(255, 255, 255, 0));   // subnet FF FF FF 00

        // You can remove/add the password parameter if you want the AP to be open/closed.
        WiFi.softAP(ssid);     //, password);

        // if DNSServer is started with "*" for domain name, it will reply with
        // provided IP to all DNS request
        dnsServer.setErrorReplyCode(DNSReplyCode::NoError);
        dnsServer.start(DNS_PORT, "*", apIP);

        IPAddress myIP = WiFi.softAPIP();
        Serial.print("AP IP address: ");
        Serial.println(myIP);

        /**** ROUTES ****/

        webServer.on("/generate_204", handleRoot);     // Android captive portal.
        webServer.on("/fwlink", handleRoot);           // Microsoft captive portal.

        webServer.on("/", handleRoot);

        webServer.on("/switch_state", switch_led);

        webServer.on("/won", won_game);

        webServer.onNotFound(handleNotFound);

        // Start WebServer
        webServer.begin();
        Serial.println("HTTP server started");
}

/**
 * The loop routine runs over and over again forever.
 */
void
loop()
{
        dnsServer.processNextRequest();
        webServer.handleClient();
}
