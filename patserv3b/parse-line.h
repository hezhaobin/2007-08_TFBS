/* Copyright 1990, 1997 Gerald Z. Hertz
 * May be copied for noncommercial purposes.
 *
 * Author:
 *   Gerald Z. Hertz
 *   Dept. of Molecular, Cellular, and Developmental Biology
 *   University of Colorado
 *   Campus Box 347
 *   Boulder, CO  80309-0347
 *
 *   hertz@colorado.edu
 */


/* Declaration of functions defined in "parse_line.c" and useful definitions.*/

/* The main functions for parsing the command line. */
extern int parse_line();   /* The function for parsing the command line. */
extern void usage();       /* Print a usage message to the standard error. */

/* Declaration of the general functions that will process different
 * command line options.  Returns the index to the next command line
 * variable to be processed. */
extern int pl_NBool(); /* Assign the integer 0 to the named char. */
extern int pl_Bool();  /* Assign the integer 1 to the named char. */
extern int pl_Int_2(); /* Assign the integer 2 to named char. */
extern int pl_Int_3(); /* Assign the integer 3 to named char. */
extern int pl_Int_4(); /* Assign the integer 4 to named char. */
extern int pl_IChar(); /* Assign the following int to the named char. */
extern int pl_Int();   /* Assign the following int to the named int. */
extern int pl_P_Int(); /* Assign the following positive int to the named int.*/
extern int pl_Nn_Int();/* Assign following non-negative int to named int.*/
extern int pl_Double();/* Assign the following double to the named double. */
extern int pl_P_Double();/* Assign following double to named positive double.*/
extern int pl_Nn_Double(); /* Assign following non-negative to named
			    * positive double.*/
extern int pl_String();/* Assign the following string to the named (char *). */


/* Useful macros for describing an OPTION array. */
#define YES 1
#define NO 0
#define END ""         /* An empty string. */
#define OPT 0          /* An optional command line option. */
#define REQ 1          /* A required command line option. */
#define HID 3          /* A hidden command line option
			* (i.e., not described in the usage message. */ 


/* Define the structure describing the command line arguments. */
typedef struct struct_OPTION
{
  char    *opt_string;   /* The argument's string name */
  char    opt_flag;      /* Flag indicating argument is optional (OPT),
			  * required (REQ), or hidden (HID). */
  int     (*opt_func)(); /* Function processing the specific option. */
  void    *opt_var;      /* The variable to be changed by the function. */
  char    *opt_descrpt;  /* A description of the option. */
} OPTION;
