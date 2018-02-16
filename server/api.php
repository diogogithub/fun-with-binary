<?php
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
 *
 * api.php
 *
 * Fun with Binary
 * Web Server
 *
 * Diogo Peralta Cordeiro
 * up201705417@fc.up.pt
 *
 * Generates the chalenges and controls the arduino
 */
header('Access-Control-Allow-Origin: *');

class game
{
    /*
     * ==Warning==
     * You must add www-data to dialout group
     * for serial port communication to work!
     */

    // Arduino related
    protected $comPort = "/dev/ttyACM0";
    protected $arduino_available = true;

    // Storage related
    public $correct_answer_path = "/var/www/answer.txt";
    public $current_answer_path = "/var/www/current_binary_digit.txt";

    /**
     * Prepares everything for a new game
     */
    public function reset()
    {
        // Reset current binary digit for a potential new game
        $fp = fopen($this->current_answer_path, "w");
        fwrite($fp, "000000");

        // Sends reset command to Arduino
        if ($this->arduino_available) {
            $fp = fopen($this->comPort, "wb");
            fwrite($fp, 9); // 9 is the Reset Byte
        }
    }

    /**
     * Starts game
     */
    public function start()
    {
        // Generates a 6-bit random number
        $number = rand(0, 63);

        // Memorizes the correct binary answer
        $fp = fopen($this->correct_answer_path, "w");
        fwrite($fp, sprintf("%06d", decbin($number)));

        return $number;
    }

    /**
     * Turn current answer bits accordingly
     */
    public function change_state($led_id)
    {
        // Update and memorize the new current answer
        $current_binary_digit = file_get_contents($this->current_answer_path);
        $current_binary_digit[(int)$led_id] = ($current_binary_digit[(int)$led_id] == 1) ? 0 : 1;
        $fp = fopen($this->current_answer_path, "w");
        fwrite($fp, $current_binary_digit);

        // Updates Arduino output
        if ($this->arduino_available) {
            $fp = fopen($this->comPort, "wb");
            fwrite($fp, (int)$led_id);
        }
    }

    /**
     * Compares the given answer with the right answer and tells the result
     * Returns true if won, false otherwise
     */
    public function end($given_answer, $correct_answer)
    {
        if ($given_answer == $correct_answer) { // Won
                        // Sends Won command to Arduino
            if ($this->arduino_available) {
                $fp = fopen($this->comPort, "wb");
                fwrite($fp, 7); // 7 is the Won Byte
            }

            return true;
        } else { // Lost
                        // Sends Lost command to Arduino
            if ($this->arduino_available) {
                $fp = fopen($this->comPort, "wb");
                fwrite($fp, 8); // 8 is the Lost Byte
            }

            return false;
        }
    }
}

/**
 * API Handler
 */
$game = new game();

if (isset($_GET["start"])) {
    $game->reset();
    $number = $game->start();

    // Print out the number and let the games begin
    echo $number;
} elseif (isset($_GET["change_state"])) {
    $led_id = $_GET["change_state"];
    $game->change_state($led_id);
} elseif (isset($_GET["end"])) { // Game Over
    $given_answer = file_get_contents($game->current_answer_path);
    $correct_answer = file_get_contents($game->correct_answer_path);

    if ($game->end($given_answer, $correct_answer)) {
        echo "That's right!";
    } else {
        echo "Oops, the answer was: ".$correct_answer;
    }
}
