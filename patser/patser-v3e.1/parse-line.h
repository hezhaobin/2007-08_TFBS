/* Copyright 1990, 1997, 2001, 2002 Gerald Z. Hertz
 * May be copied for noncommercial purposes.
 *
 * Author:
 *   Gerald Z. Hertz
 *   hertz@colorado.edu
 */


/* Useful definitions for "parse_line.c".
 * Declaration of functions defined in "parse_line.c". */

/* EXCEPTIIONS */
/* The function "pl_Help()" is defined in "parse-line-help.c". */

/* The functions "pl_Alpha_af()", "pl_Alpha_if()", and "pl_Alpha_ac()"
 * for reading alphabet information are defined in "alpha.c". */


/* Useful macros for describing an OPTION array. */
#define YES 1
#define NO 0
#define END ""             /* An empty string. */
#define MSG (char *)NULL   /* Indicates a message instead of an option. */
#define OPT 0              /* An optional command line option. */
#define REQ 1              /* A required command line option. */
#define HID 3              /* A hidden command line option
			    * (i.e., not described in the usage message. */

/* Character prefixing each command line option. */
#define COMMANDCHAR '-'


/* Define the structure describing the command line arguments. */
typedef struct struct_OPTION
{
  char    *opt_string;   /* The argument's string name */
  char    opt_flag;      /* Flag indicating argument is optional (OPT),
			  * required (REQ), or hidden (HID). */

  /* Function processing the specific option. */
  int     (*opt_func)(void *variable, int argc, char *argv[], int i, int k);

  void    *opt_var;      /* The variable to be changed by the function. */
  char    *opt_descrpt;  /* A description of the option. */
} OPTION;


/* The main functions for parsing the command line. */

/* The function for parsing the command line. */
extern int parse_line(
     OPTION *options,      /* Vector describing the options. */
     char **exclusive,     /* Vector indicating mutually exclusive options. */
     int argc,             /* Number of variables on the command line. */
     char *argv[]);        /* The table of command line strings. */

/* Print a usage message to the standard error. */
extern void usage(
     OPTION *options,      /* Vector describing the options. */
     char *message,        /* An additional help message. */
     char *argv[]);        /* The table of command line strings. */


/* "pl_Help()" is defined in the file "parse-line-help.c".
 * If pl_Help is called, a function "text_directions()" for printing
 * the text of the directions needs to be defined in another file.

   #ifndef OPTIONS
   #include <stdio.h>
   #else
   #include "options.h"
   #endif

   void text_directions(
	FILE *fp)      / Output stream for printing the directions. /
   {
     fprintf(fp, "Text of the directions.\n");
   }
 */

/* The functions "pl_Alpha_af()", "pl_Alpha_if()", and "pl_Alpha_ac()"
 * for reading alphabet information are defined in "alpha.c". */


/* Declaration of the general functions that will process different
 * command line options.  Returns the index to the next command line
 * variable to be processed. */


/* Page the directions from the function "text_directions(FILE *fp)". */
extern int pl_Help(void *variable, int argc, char *argv[], int i, int k);


/* Read ascii alphabet information from a file. */
extern int pl_Alpha_af(void *variable, int argc, char *argv[], int i, int k);

/* Read integer alphabet information from a file. */
extern int pl_Alpha_if(void *variable, int argc, char *argv[], int i, int k);

/* Read alphabet information from command line. */
extern int pl_Alpha_ac(void *variable, int argc, char *argv[], int i, int k);


/* Assign the integer 0 to the named char. */
extern int pl_NBool(void *variable, int argc, char *argv[], int i, int k);

/* Assign the integer 1 to the named char. */
extern int pl_Bool(void *variable, int argc, char *argv[], int i, int k);

/* Assign the integer 2 to named char. */
extern int pl_Int_2(void *variable, int argc, char *argv[], int i, int k);

/* Assign the integer 3 to named char. */
extern int pl_Int_3(void *variable, int argc, char *argv[], int i, int k);

/* Assign the integer 4 to named char. */
extern int pl_Int_4(void *variable, int argc, char *argv[], int i, int k);

/* Assign the following int to the named char. */
extern int pl_IChar(void *variable, int argc, char *argv[], int i, int k);

/* Assign the following int to the named int. */
extern int pl_Int(void *variable, int argc, char *argv[], int i, int k);

/* Assign the following positive int to the named int.*/
extern int pl_P_Int(void *variable, int argc, char *argv[], int i, int k);

/* Assign following non-negative int to named int.*/
extern int pl_Nn_Int(void *variable, int argc, char *argv[], int i, int k);

/* Assign the following double to the named double. */
extern int pl_Double(void *variable, int argc, char *argv[], int i, int k);

/* Assign following positive double to named double.*/
extern int pl_P_Double(void *variable, int argc, char *argv[], int i, int k);

/* Assign following non-negative double to named double.*/
extern int pl_Nn_Double(void *variable, int argc, char *argv[], int i, int k);

/* Assign following negative double to named double. */
extern int pl_N_Double(void *variable, int argc, char *argv[], int i, int k);

/* Assign following non-positive double to named double. */
extern int pl_Np_Double(void *variable, int argc, char *argv[], int i, int k);

/* Assign the following string to the named (char *). */
extern int pl_String(void *variable, int argc, char *argv[], int i, int k);

/* Assign the last char of the option's name to the named char. */
extern int pl_Char(void *variable, int argc, char *argv[], int i, int k);
