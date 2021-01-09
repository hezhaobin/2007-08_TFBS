/* Copyright 1990, 1992 Gerald Z. Hertz
 * May be copied for noncommercial purposes.
 *
 * Author:
 *   Gerald Z. Hertz
 *   Dept. of Molecular, Cellular, and Developmental Biology
 *   University of Colorado
 *   Campus Box 347
 *   Boulder, CO  80309-0347
 *
 *   hertz@boulder.colorado.edu
 */


/* Declaration of functions defined in "alpha.c" and
 * used to read alphabet information. */

/* Read alphabet from indicated file, if not already read from command line.
 * Make sure the alphabet is complementary if both strands are being used.
 * Make sure none of the characters in the alphabet occur more than once.
 * Convert the alphabet normalizations to frequencies. */
extern void adjust_alphabet();

/* Print the alphabet information. */
extern void print_alpha();

/* Find beginning of data line.  Scans over any comments
 * or whitespace.  Return values:
 *     position within the file
 *     -1L: EOF reached. */
extern long find_line();


/* Functions used by the function "parse_line()" */
extern int pl_Alpha_af(); /* Read ascii alphabet information from a file. */
extern int pl_Alpha_if(); /* Read integer alphabet information from a file. */
extern int pl_Alpha_ac(); /* Read alphabet information from the command line. */
