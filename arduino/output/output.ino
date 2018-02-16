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
 * output.ino
 *
 * Fun with Binary
 * Arduino Controller
 *
 * Diogo Peralta Cordeiro
 * up201705417@fc.up.pt
 *
 * Receives input via the searial port and turn the leds accordingly.
 */

// int bits[6] = {12, 10, 8, 6, 4, 2};
int bits[6] = { 2, 4, 6, 8, 10, 12 };

// Memorizes bits state
int bits_state[6] = { 0 };

// for incoming serial data
int incomingByte = 0;

// the setup routine runs once when you press reset:
void
setup()
{
        // initialize the digital pins as an output.
        for (int i = 0; i < 6; i++)
        {
                pinMode(bits[i], OUTPUT);
        }

        // initialize serial communication at 9600 bits per second:
        Serial.begin(9600);
}



// the loop routine runs over and over again forever:
void
loop()
{
        if (Serial.available() > 0)
        {
                // read the incoming byte:
                incomingByte = Serial.read() - '0';

                // handle it
                if (incomingByte == 7)
                {
                        won_game();
                }
                else if (incomingByte == 8)
                {
                        lost_game();
                }
                else if (incomingByte == 9)
                {
                        reset_game();
                }
                else if (bits_state[incomingByte] == 1)
                {               // Turn LED off
                        digitalWrite(bits[incomingByte], LOW);
                        bits_state[incomingByte] = 0;
                }
                else
                {               // Turn LED on
                        digitalWrite(bits[incomingByte], HIGH);
                        bits_state[incomingByte] = 1;
                }
        }
}

/**
 * Blinks every LED while waits for reset signal
 */
void
won_game()
{
        while (true)
        {
                // read the incoming byte:
                incomingByte = Serial.read() - '0';
                if (incomingByte == 9)
                {
                        reset_game();
                        break;
                }

                for (int i = 0; i < 6; i++)
                {
                        digitalWrite(bits[i], LOW);
                }

                delay(1000);

                for (int i = 0; i < 6; i++)
                {
                        digitalWrite(bits[i], HIGH);
                }

                delay(1000);
        }
}

/**
 * Blinks red LEDs while waits for reset signal
 */
void
lost_game()
{
        for (int i = 0; i < 6; i++)
        {
                digitalWrite(bits[i], LOW);
        }

        while (true)
        {
                // read the incoming byte:
                incomingByte = Serial.read() - '0';
                if (incomingByte == 9)
                {
                        reset_game();
                        break;
                }

                digitalWrite(bits[0], LOW);
                digitalWrite(bits[2], LOW);
                digitalWrite(bits[4], LOW);

                delay(1000);

                digitalWrite(bits[0], HIGH);
                digitalWrite(bits[2], HIGH);
                digitalWrite(bits[4], HIGH);

                delay(1000);
        }
}

/**
 * Resets for a potential new game
 */
void
reset_game()
{
        for (int i = 0; i < 6; i++)
        {
                digitalWrite(bits[i], LOW);
                bits_state[i] = 0;
        }
}
