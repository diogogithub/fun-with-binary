/*
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
 * @category  UI interaction
 * @package   Fun with Binary
 * @author    Diogo Cordeiro <up201705417@fc.up.pt>
 * @copyright 2018 Diogo Cordeiro.
 * @license   http://www.fsf.org/licensing/licenses/agpl-3.0.html GNU Affero General Public License version 3.0
 * @link      https://www.diogo.site/projects/fun_with_binary/
 */

/***********************************
 * EXTEND JAVASCRIPT FUNCTIONALITY *
 ***********************************/

/**
 * Returns a random integer between min(inclusive) and max(inclusive)
 * Using Math.round() would give a non-uniform distribution!
 */
function getRandomInt(min, max)
{
    return Math.floor(Math.random() *(max - min + 1)) + min;
}

/**
 * Replace char at given position
 */
String.prototype.replaceAt=function(index, replacement)
{
    return this.substr(0, index) + replacement+ this.substr(index +
                                                        replacement.length);
}

/**
 * Checks if session storage is available
 */
function is_session_storage_available()
{
   return window.sessionStorage != null;
}

/***********************************
 *         GAME SETTINGS           *
 ***********************************/
// Online Mode (only used in Online Mode)
ONLINEMODE = true;

// Box IP
ONLINEURL = "http://42.42.42.42/game/";

// Number of leds
NLEDS = 6;

// Activate the Show 2 powers Labels feature
HAVELABELS = true;

// Default Show 2 powers Labels feature mode
show_labels = true;

// Easter Egg
EASTEREGG = true;

// ON and OFF leds srcs
LED_OFF = "data:image/png;base64,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";
LED_ON  = "data:image/png;base64,R0lGODlhZAC0ANX/AMDAwP//zP//mf//Zv//M///AP/M///MzP/Mmf/MZv/MM/+Zmf+ZZv+ZM8z//8z/zMz/Zsz/M8zM/8zMzMzMmczMZsyZzMyZmcyZZsyZM5nMzJnMmZmZzJmZmZmZZplmZplmM2ZmmWZmZmYzZmYzMzNmZjNmMzMzZjMzMzMzAAAzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAAAALAAAAABkALQAQAb/QIBwSCwaj8ikcslsOp/EQGFKrVqv2KzWOoB6i9KteEwmAwTZ7nc4KLvf8G2AKCBMCQQmOs7v+417VGB+hIWGV3MAh2IEAmtEbYtaeXaSVwQDlVUDAgGenwF1VgQUFJaXDkKnaaZxE6tYR7BXGpqTFZmzd3lMulSvFBMTGhN4BK+6eI8AkYcEGsETHRMc1BQc0RfFi8rLSYYEFsLT1BPB5MiFat5OYXzC0sLRFOQdhOzervDk1RMX/OkYAZjwwAA+fG+OlUNnLl45MwMTHcRnq4AdCOM6aOywAZ65fvG0SduoUVgFPAVSDTwwsSWAAw4skJxJs+bMCUdGknPpkgGD/wQIgDIIiqDoUKEIhv5MsNQngwZQoyI4gADq0wYJeLokGnTpAgQLEnxNQDbsz6NnfTYYSvXAVaUNEGidWBVsUbFkiaJ1GvVq1L5QgRqVOnduAAYKlCYlChRv0bBG9SaNKrGw5SMiVqxAMcIECs8lUGgevULE5dNEKloiUBm1kma+DGmFHVvSOgC2eD2pzbuKEdhJaPceLoYO8QKOmAj3xSs2nmDLzKk+lcfdLFIn+ZBafgoS71ZlME4/1XqI9Vm1xOSK7WW8nwETOl6L77HfhfSrJwYq5JFcMGz1BERIcpZxR8Yz4whTDYDwENKNa0No1w9D5zToBid2EAjhIG/0l/8ggw0dCIAEOG2oxHlieNhQghZuIcQEMJm4hAMkbmDTjTjeWOJAO8rYxFpFBRAjPDx6lOA0SBoJTwASBJDUU3L52ERRj4nVlVNnJfDXllxi1VhXf0nZhJZrHcXVUGPdxdiaj3U1GQNOEiZmE4cBGZRjig0VFGR4meWUlVVRNic+E6SwGQgeYIDXWQv8ycAHIBjawaA8hdIHJ5R+EYB7sFSi4ZzrHTcGhBaJOiBPnJqaRTcBhDrFp1CgqGofldlym3KzdlfEJrjmugqsVpSniq+zJJJJRY0YQayv5uVqx7OzNtebsMqluogjvBVBokcsvUgkHdYWQokvpTxLbRLuTBD/gS9dOBDue+Bp5yosc8i6yjZxVEDBu34QaO8pExiYBQUCc2MEv30QkF0Z8epC7b+WLDyJgJ02URu+WJQS261MIJyQNNh41JE2KMHC8RMlO0PfBhZ0VM002FgQDAS64gMxHCs6hA0H5GgjCawHeZwFMSwGQ0+LhQDtkiEegjTNfUKPsiEh6PBToTBRT3HyaaLAQYqC8xmNjteVnMs1Hx2xKIxM5uBHxgAPBNCjlF2XYSTM/mjAUBnJzS0mzlUnePQwGGvRhdwSZHpGh/3srKIwYzhiwAN+z2ktSiteE81IHlmUMq8vVW45FRHoZBMx0ZAkUkY3EgGj4kQ4YHqOtNfk//dOsBfBEk775Ci6t6YLA9MBZg96F1NHCUYlAgEY9OJL0LMk5PJgchll7kNo+ZSZYDkGVJqCMRWVYFT5VSZU12MPQFVYEjXWWMgzJX+WZDUWFllxBSWo+kK47333Y9me+bo0PjOF5S/pw94BwveUL3HvKHxizFeuUhSqcKlb/FtfX3zypT7ZpU3fa9NX7sdBC8Ylg0ZY4FIWo5i7pEUt21sLVn5ypxOikAkBYMqaOsjBs2BlS0O54RoysxkUkAAFSDwBEkkzGhQkToje6AASp2jEJZJmUlBkhyfqNgoBdCKLXrCUg6gwgOJhT4xZO5BFlEap/YiKNZkq2HGSJaOb+f8KjqfZ1LIOtDV8uHGPZPwcGV1iR2J1448F6CMUAHkg3TDDFmZMAiIZqQUNwcaRKKNkQgoQhWA9oZCavMKnUuYELobSDZ+yDhuFAMpTYqE1qlSCK/t1ME1gMkKzTFgRVFOeVubyCmV0zy3T+MsxOJKYxRxDInyZzDgkZ5LOGUC7DOAAARzLVEJA5htWeQRormJYtYkkErxpG9zUZgkekWRtuqDNUUWkSU3g3QSquU5FkEsY3jCAOeRIiC7UphVla8J+jhEbR5CTaYZoGCwMejH+nBMAzNQOxdww0VOso51bIGgcjoHRLRDooOCoaEYLN4td1kYBGsBZbejYrHXyawL/CqgnIFYq0lHQ7KHd7CgWFMZPksJiCTrdacEUFtRLcJMZzNHYJBS6CkV6h1zNgNYUfFozJ/AzYQqxhgU0IA5iMGcNESXDfxqyVRiNA3UmW0ZYtxABcYhjbZsLBjEsENSjdkwS4ZjAW+VhJGJwQKctsUQ5BLcPYXhVEuK06iIGG4+QOWQY7bzlQa4qhrambrA8g0dkLdNOD80ns9RYxNkKAQ3CgqimbnCNKeGw12kYDbSohYhr1jrVwkYDtBwohIz8kNXG/mdsfkhsYPvgNAVRAx1ppFsfPLsgfsBhD5KFUNQ8BLPBxXYTJHqimJhJAAi09iMU0Bs8KoBKA5CIUgg7/0bg5OqQYIQrD/iklC/VW9gVASRcc4jvoOZ7t/qQQxwiiojicEZdBfnnuo44r+IQljPXvowh1nqRdtvohmNsLkAliQenkvUACWAwUxVmLN6SpOGMCkECBcndcqClkMw6Tm2E0wg2TGGMQY7oAdiLqsJwJLPiGjYeONLvPHNsEQTUTsZHtt0QhKGS3B1gdklOsn4HMo0MQjnKQTYC535HKYJcGcuVywg+uTyoBcrlvP3RkZJmJ4wmJc4Bh0kg9qyiPOLxCAAOmByReOeA4ckOzwBw3gFU2BcUSsZ+8ttTB6m3PKGIj4AN+HDu2KfDRTnwTvI74ADXQr5HR0XS2EtKXv/KMmoA5iUtQJThBvVnFUOvkNRkQQyk/4KlL0HmKDJkAAoDwKXkNQZQyuMK9bxCJfPdsHyXHjWguCIUvtB6LYmpn1/krDhOX5qG0iZTrgNDv/B1RSjouyEHraKUX5tF0SwUdf3MgpWpaFvXN7wTtk2Nbgcib9O5nl9gUHgAbp9pMb/OtvxiXb+8uBB/UAF1qMcHpP8JHODKljdQ6rQWMAJAS99btPxmnerzNUC4insK+PRipYDfaYdggrfFdddupCgGL42hIZYQuHIldAADNAQ4ZJh9vAZkAAQ1b0IImqhE0HwGBSpgomZQEHQnTGDpnlHiEY+o9BVgselOEM0USaAXRCuSButr6IAIPlACEZhABFpHQZVlFAQAOw==";

/**********************************
 *        ACTUAL GAME CODE        *
 **********************************/

/**
 * Global variables
 */
// Empty Answer
empty_answer = '';
while (empty_answer.length < NLEDS)
{
        empty_answer += '0';
}

// correct answer
correct_answer = empty_answer;

// current answer
current_answer = empty_answer;

// Generate a token for this session
sessionStorage.token = Math.random().toString(36).substr(2, 15+2);

/**
 * Create leds
 */
for (let i = 0; i < NLEDS; ++i)
{
        // Led holder
        let figure = document.createElement("figure");
        figure.setAttribute("class", "box");

        // Label
        if (HAVELABELS)
        {
                let c_label = Math.pow(2, NLEDS-i-1);
                let figcaption = document.createElement("figcaption");
                figcaption.setAttribute("value", c_label);
                figcaption.setAttribute("class", "text labels");
                figcaption.id = "label" + i;
                figcaption.innerHTML = c_label;
                figure.appendChild(figcaption);
        }
        else
        {
                document.getElementById('label_switch_button').setAttribute("style", "display:none");
        }

        // Led
        let img = document.createElement("img");

        // Set img src
        if (is_session_storage_available()
                && sessionStorage.playing == 'true'
                && sessionStorage.current_answer.charAt(i) == '1')
        {
                img.src = LED_ON;
                img.setAttribute("value", "ON");
        }
        else
        {
                img.src = LED_OFF;
                img.setAttribute("value", "OFF");
        }

        img.id = "led" + i;
        img.setAttribute("class", "led");
        img.setAttribute("onclick", "switch_led("+i+")");
        figure.appendChild(img);

        document.getElementById("leds").appendChild(figure);
}

// If initial value for label is false, handle it
if (HAVELABELS && !show_labels)
{
        show_labels = true;
        document.getElementById("label_switch").click();
}

// Let the game begin
get_game();

/**
 * Switch labels
 */
function switch_labels()
{
        if (show_labels)
        {
                for (let i = 0; i < NLEDS; ++i)
                {
                        document.getElementById("label"+i).setAttribute
                               ("style", "visibility:hidden");
                }
        }
        else
        {
                for (let i = 0; i < NLEDS; ++i)
                {
                        document.getElementById("label"+i).setAttribute
                               ("style", "");
                }
        }

        show_labels = !show_labels;
        cache_current_game();
}

/**
 * Turn current answer bits accordingly
 */
function switch_led(led_id)
{
        let image = document.getElementById("led"+led_id);
        if (image.getAttribute("value") == "ON")
        {
                image.setAttribute("value", "OFF");
                image.src = LED_OFF;

                current_answer = current_answer.replaceAt(led_id, "0");
        }
        else
        {
                image.setAttribute("value", "ON");
                image.src = LED_ON;

                current_answer = current_answer.replaceAt(led_id, "1");
        }

        cache_current_game();

        // Easter egg
        if (EASTEREGG && current_answer == (empty_answer.substr(6) + "101010"))
        {
                alert("That's the answer to life, the universe and everything!");
        }

        // If we are connected to the box
        if (ONLINEMODE)
        {
                let xhttp = new XMLHttpRequest();
                xhttp.open("GET", ONLINEURL+"switch_state?led=" + led_id +
                                 "&token=" + sessionStorage.token, true);
                xhttp.send();
        }

        // If right answer, finish game, restart a new one
        if (current_answer == correct_answer)
        {
                end_game();
                restart_game();
        }
}

/**
 * Sets problem statement's decimal number
 */
function set_statement(n_dec)
{
        document.getElementById("statement_value").innerHTML = n_dec;
}

/**
 * Recovers game from page reload
 */
function get_game()
{
        if (!is_session_storage_available() || sessionStorage.playing != 'true')
        {
                start_game();
        }
        else
        {
                restore_from_cache();
        }
}

/**
 * Restore current game from cache
 */
function restore_from_cache()
{
        correct_answer = sessionStorage.correct_answer;
        current_answer = sessionStorage.current_answer;
        set_statement(Number(sessionStorage.number_dec));

        if (HAVELABELS && sessionStorage.show_label != show_labels.toString())
        {
                show_labels = true;
                document.getElementById("label_switch").click();
        }
}

/**
 * Caches current game
 */
function cache_current_game()
{
        if (!is_session_storage_available())
        {
                return;
        }

        sessionStorage.current_answer = current_answer;
        sessionStorage.show_label     = show_labels;
}

/**
 * Starts game
 */
function start_game()
{
        let n_dec      = getRandomInt(1, Math.pow(2, NLEDS)-1);
        let n_bin      = n_dec.toString(2);
        correct_answer = empty_answer.substr(n_bin.length) + n_bin;

        set_statement(n_dec);

        if (is_session_storage_available())
        {
                sessionStorage.playing        = true;
                sessionStorage.correct_answer = correct_answer;
                sessionStorage.number_dec     = n_dec;

                cache_current_game();
        }
}

/**
 * Prepares everything for a new game
 */
function reset_game()
{
        correct_answer = empty_answer;
        current_answer = empty_answer;
        turn_all_leds_images_off();
        for (let i = 0; i < NLEDS; ++i)
        {
                document.getElementById("led"+i).setAttribute("value", "OFF");
        }
}

/**
 * Start a new game
 */
function restart_game()
{
        reset_game();
        start_game();
}

/**
 * Finishes the game
 */
function end_game()
{
        // If we are connected to the box
        if (ONLINEMODE)
        {
                let xhttp = new XMLHttpRequest();
                xhttp.open("GET", ONLINEURL+"won" +
                                 "?token=" + sessionStorage.token, true);
                xhttp.send();
        }

        // Blink correct answer leds 3 times
        blink_led_effect(3, correct_answer);

        // Reset cache
        if (is_session_storage_available())
        {
                sessionStorage.clear();
        }
}

/**
 * Turn every led on(without turning value attribute)
 */
function turn_leds_images_on(which)
{
        // Turn all on
        for (let i = 0; i < NLEDS; ++i)
        {
                if (which.charAt(i) == '1')
                {
                        document.getElementById("led"+i).src = LED_ON;
                }
        }
}

/**
 * Turn every led off(without turning value attribute)
 */
function turn_all_leds_images_off()
{
        // Turn all off
        for (let i = 0; i < NLEDS; ++i)
        {
                document.getElementById("led"+i).src = LED_OFF;
        }
}

/**
 * Makes leds blink i times
 */
function blink_led_effect(i, which)
{
        // Because the recursive function fulfills an action every two iterations
        blink_led_effect_helper(i*2, which);
}

/**
 * Makes leds blink i/2 times
 */
function blink_led_effect_helper(i, which)
{
        if (i % 2 == 1)
        {
                turn_leds_images_on(which);
        }
        else
        {
                turn_all_leds_images_off();
        }

        if (--i > -1)
        {
                setTimeout(function() { blink_led_effect_helper(i, which); }, 500);
        }
}
