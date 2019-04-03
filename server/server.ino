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
#include "HTML.h"

// Define a dns server for Captive Portal
const byte DNS_PORT = 53;
DNSServer dnsServer;

IPAddress apIP(42, 42, 42, 42); // Defining a static IP address: local & gateway
                                // Default IP in AP mode is 192.168.4.1
IPAddress netMsk(255, 255, 255, 0);

// These are the WiFi access point settings. Update them to your liking
const char *ssid = "Fun with Binary";
//const char *wifi_password = "";

// Define a web server at port 80 for HTTP
ESP8266WebServer webServer(80);

// Number of leds
#define NLEDS 6

// LEDs board outputs
int bits[NLEDS] = { D0, D1, D2, D3, D4, D5 };

// Memorizes bits state
int current_answer[NLEDS] = { 0 };

// Current state of the game
bool is_game_running = false;
// Current system password
String password = "000000";
// Current system token
int token = 0;

// This is an emergency endpoint in case some of students decides to leave
// in the middle of a game, you should rename it in production as a security
// measure
const String FORCERESTARENDPOINT = "force_restart";

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
        webServer.send(200, "text/html",
                        "<meta http-equiv=\"refresh\" content=\"0; url=http://42.42.42.42/auth\" />");
}

/**
 * Game endpoint
 */
void
handleGame()
{
        webServer.setContentLength(gameHTML1().length() +
                                    gameHTML2().length() +
                                    gameHTML3().length() +
                                    gameHTML4().length());
        webServer.send(200, "text/html", gameHTML1());
        webServer.sendContent(gameHTML2());
        webServer.sendContent(gameHTML3());
        webServer.sendContent(gameHTML4());
}

/**
 * CSS endpoint
 */
void
return_css()
{
        webServer.send(200, "text/css", cssHTML());
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
 * Auth endpoint
 */
void
handleAuth()
{
        if (webServer.method() == HTTP_GET)
        {
                webServer.setContentLength(authHTML1().length() +
                                            authHTML2().length() +
                                            authHTML3().length() +
                                            authHTML4().length());
                webServer.send(200, "text/html", authHTML1());
                webServer.sendContent(authHTML2());
                webServer.sendContent(authHTML3());
                webServer.sendContent(authHTML4());
        }
        else if (webServer.method() == HTTP_POST)
        {
                if (!is_game_running)
                {
                        if (password == webServer.arg("password"))
                        {
                                is_game_running = true;
                                token = webServer.arg("token").toInt();
                                webServer.send(200, "text/html", "ok");
                                turn_all_off();
                                Serial.print("Current valid token is: ");
                                Serial.println(token);
                        }
                        else
                        {
                                webServer.send(200, "text/html",
                                                "Esta palavra-passe está errada.");
                        }
                }
                else
                {
                        webServer.send(200, "text/html",
                                        "Já está alguém a jogar, espera pela tua vez! :)");
                }
        }
        else
        {
                // Invalid HTTP request method
                handleInputError();
        }
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

        for (uint8_t i = 0; i < webServer.args(); ++i)
                message +=
                    " " + webServer.argName(i) + ": " + webServer.arg(i) +
                    "\n";

        webServer.send(404, "text/plain", message);
}

/**
 * Switches a led state (a.k.a. bit of current answer)
 *
 * **Updates current_answer**
 */
void
switch_led()
{
        if (!is_game_running || token != webServer.arg("token").toInt())
        {
                webServer.send(200, "text/plain", "unauthorized");
                Serial.print("Invalid token tried to play: ");
                Serial.println(webServer.arg("token").toInt());
                return;
        }

        int incomingByte = webServer.arg("led").toInt();

        if (incomingByte >= NLEDS || incomingByte < 0)
        {
                handleInputError();
                return;
        }

        String message = "Led ";

        if (current_answer[incomingByte] == 1)
        {                       // Turn LED off
                message += incomingByte;
                message += " off!";
                digitalWrite(bits[incomingByte], LOW);
                current_answer[incomingByte] = 0;
        }
        else
        {                       // Turn LED on
                message += incomingByte;
                message += " on!";
                digitalWrite(bits[incomingByte], HIGH);
                current_answer[incomingByte] = 1;
        }
        webServer.send(200, "text/plain", message);
}

/**
 * Generates a binary string password with NLEDS length
 * Result is stored in global password variable
 */
void
generate_password()
{
        unsigned int dec_password = random(1, pow(2, NLEDS)-1);
        char tmp_password[] = "000000";
        for (int i = NLEDS-1; i > 0; --i)
        {
                tmp_password[i] =(dec_password & 1) + '0';
                dec_password >>= 1;
        }

        for (int i = 0; i < NLEDS; ++i)
        {
                if (tmp_password[i] == '1')
                {
                        password.setCharAt(i, '1');
                }
        }
        Serial.print("Password is: ");
        Serial.println(password);
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

        is_game_running = false;
        token = 0;

        generate_password();

        // print password
        print_binary_string(password);
}

/**
 * Blinks current_answer for 3 seconds (3 times) and resets the game
 */
void
won_game()
{
        if (!is_game_running || token != webServer.arg("token").toInt())
        {
                webServer.send(200, "text/plain", "unauthorized");
                return;
        }

        for (int i = 0; i < 3; ++i)
        {
                turn_all_off();

                delay(500);

                for (int i = 0; i < NLEDS; ++i)
                {
                        if (current_answer[i] == 1)
                        {
                                digitalWrite(bits[i], HIGH);
                        }
                }

                delay(500);
        }

        reset_game();

        webServer.send(200, "text/plain", "ok");
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
        WiFi.softAP(ssid);     //, wifi_password);

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
        webServer.on("/auth", handleAuth);
        webServer.on("/"+FORCERESTARENDPOINT,[]()
                      {
                      reset_game();
                      webServer.send(200, "text/plain",
                                      "A caixa foi reiniciada com sucesso!");});
        webServer.on("/game", handleGame);
        webServer.on("/style.css", return_css);

        webServer.on("/game/switch_state", switch_led);

        webServer.on("/game/won", won_game);

        //webServer.onNotFound(handleNotFound);
        webServer.onNotFound(handleRoot);

        // Start WebServer
        webServer.begin();
        Serial.println("HTTP server started");

        /*** Start game ***/
        generate_password();
        // print password
        print_binary_string(password);
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
