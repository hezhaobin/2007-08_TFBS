/* Copyright 1997, 2002 Gerald Z. Hertz
 * May be copied for noncommercial purposes.
 *
 * Author:
 *   Gerald Z. Hertz
 *   gzhertz AT alum.mit.edu
 */


#ifndef OPTIONS
#include <stdio.h>
#include <stdlib.h>
#else
#include "options.h"
#endif
#include "parse-line.h"


/* Call the function "print_directions". */
int pl_Help(
     void *variable,     /* Address of the variable to be updated. */
     int argc,           /* Number of variables on the command line. */
     char *argv[],       /* The table of command line strings. */
     int i,              /* The index to the current command line string. */
     int k)              /* Index to current position of the current string. */
{
  static void print_directions(void);

  if (k != 0)
    {
      fprintf(stderr, "\"%s\" (item %d on the command line) ", argv[i], i);
      fprintf(stderr, "does not match any of the legal options.\n\n");
      return(NO);
    }
  else
    {
      print_directions();
      exit(0);
    }
}

/* Page the directions. */
static void print_directions(void)
{
  FILE *fp;                    /* Pointer to the paging format. */
  char *pager;                 /* Value of the environment variable PAGER. */
  void text_directions(FILE *fp);      /* The text of the directions. */


#ifndef unix
  text_directions(stdout);
#else
  /* Determine the format for printing the directions. */
  pager = getenv("PAGER");

  /* Determine the pointer to the printing format. */
  if (pager == (char *)NULL)
    fp = popen("more", "w");
  else
    fp = popen(pager, "w");

  /* Print the directions and close. */
  if (fp == (FILE *)NULL) fp = stdout;
  text_directions(fp);
  if (fp != stdout) pclose(fp);
#endif
}
