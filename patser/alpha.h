/* Copyright 1990, 1992, 1997, 1998, 2001 Gerald Z. Hertz
 * May be copied for noncommercial purposes.
 *
 * Author:
 *   Gerald Z. Hertz
 *   hertz@colorado.edu
 */


/* Declaration of functions defined in "alpha.c" and
 * used to read alphabet information. */

/* Read alphabet from indicated file, if not already read from command line.
 * Make sure the alphabet is complementary if both strands are being used.
 * Make sure none of the characters in the alphabet occur more than once.
 * Convert complementary letters to the same a priori probabilities
 * if both strands are being used.
 * Convert the alphabet normalizations to frequencies. */
extern void adjust_alphabet(void);

/* Print the alphabet information. */
extern void print_alpha(void);

/* Find the beginning of a data line (can be used with stdin).
 * Returns the ASCII code for the first  character of the data line;
 * returns EOF at the end of the file. */
extern int find_line_2(
     FILE *fp);        /* Pointer to the file's input stream. */

/* Find beginning of data line in a file (cannot be used with stdin).
 * Scans over any comments or whitespace.  Return values:
 *     position within the file
 *     -1L: EOF reached. */
extern long find_line(
     FILE *fp,         /* Pointer to the file's input stream. */
     char *file);      /* The name of the input file. */


/* Functions used by the function "parse_line()": declared in "parse-line.h" /
extern int pl_Alpha_af();  / Read ascii alphabet information from a file. /
extern int pl_Alpha_if();  / Read integer alphabet information from a file. /
extern int pl_Alpha_ac();  / Read alphabet information from command line. /
 */


/* The following external variables are required and
 * can be accessed by the outside. */
extern char *Alpha_file; /* The name of the alphabet file. */
extern char Comp_status; /* Flag for whether to scan complementary strand.
                          * 0: ignore the complementary strand;
			  * 1: include both strands as separate sequences;
			  * 2: include both strands as a single sequence
			  *    (i.e., orientation unknown);
			  * 3: assume pattern is symmetrical. */
extern char Ascii;       /* Flag for whether alphabet characters are
                          * ASCII (YES) or integer (NO). */
extern char Case_sensitive;/* Flag whether letter alphabet is case sensitive.
                          *     0: case sensitive; 1: not case sensitive;
                          *     2: not case sensitive, but indicate the
                          *        locations of lowercase letters. */
extern char Comp_flag;   /* Flag indicating whether alphabet is complementary
                          * and whether any letters are their own complement.
                          *     0: no complements; 1: no own; 2: some own */
extern int A_size;       /* Alphabet size---i.e., number of letters. */
extern int *A;           /* Translation between an integral index and the
                          * corresponding letter/integer.  Convention for
                          * nucleic acid alphabets: if "n" is the index of a
                          * letter, its complement will have the index (n+1),
                          * if the letters are not the same. */
extern int *A_comp;      /* Translation between the index of a letter and
                          * the index of its complement. */
extern double *P;        /* The prior frequencies of the letters: obtained
                          * from the normalization data */
