/* Copyright 1990, 1992, 1993, 1994, 1995, 1996 Gerald Z. Hertz
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


#ifndef VMS
#include <stdio.h>
#include <stdlib.h>
#include <malloc.h>
#else
#include stdio
#include stdlib
#include malloc
#endif


/* Defined for debugging purposes only.  When defined, "calloc_error()" will
 * use "malloc()" instead of "calloc()"; thus, the GNU debugging "malloc()" can
 * be used.  WARNING: if "malloc()" is used, "calloc_error()" will not
 * initialize the array to 0's. */
#define DEBUG_ALLOC 1



/* Gerald Z. Hertz --- Tue Jul 17 13:54:47 1990
 * Source for the following six functions:
 *     malloc_error()
 *     calloc_error()
 *     realloc_error()
 *     recalloc_error()
 *     free_error()
 *
 *     bug_report()
 *
 * The first 3 functions are simply "malloc()", "calloc()", and "realloc()"
 * with an error message.  In addition, "realloc_error()" uses "malloc()"
 * if the pointer is NUll in order to ensure portability.
 *
 * The last function is a general function for reporting program bugs.
 */

/* Malloc with an error message and an exit if unsuccessful. */
void *malloc_error(size, variable, function)
     unsigned size;    /* Size of the array. */
     char *variable;   /* Name of the variable. */
     char *function;   /* Name of the calling function. */
{
  void *array;


  array = (void *)malloc(size);
  if (array == (void *)NULL)
    {
      fprintf(stderr, "Cannot malloc space for \"%s\" in the ", variable);
      fprintf(stderr, "\"%s\" function.\n", function);
      exit(1);
    }
  else
    return(array);
}

/* Calloc with an error message and an exit if unsuccessful.
 * Also, the element count is an "int" rather than an "unsigned". */
void *calloc_error(elt_count, elt_size, variable, function)
     int elt_count;        /* Number of elements in the array. */
     unsigned elt_size;    /* Size of each element. */
     char *variable;       /* Name of the variable. */
     char *function;       /* Name of the calling function. */
{
  void *array;


#ifndef DEBUG_ALLOC
  array = (void *)calloc((unsigned)elt_count, elt_size);
#else
  array = (void *)malloc((unsigned)elt_count * elt_size);
#endif

  if (array == (void *)NULL)
    {
      fprintf(stderr, "Cannot calloc space for \"%s\" in the ", variable);
      fprintf(stderr, "\"%s\" function.\n", function);
      exit(1);
    }
  else
    return(array);
}

/* Realloc with an error message and an exit if unsuccessful.  Also,
 * checks whether "array" is equal to NUll, if so, uses "malloc()" to
 * avoid problems with compilers that cannot realloc NULL pointers. */
void *realloc_error(array, size, variable, function)
     void *array;      /* The array whose size is to be modified. */
     unsigned size;    /* Size of the array. */
     char *variable;   /* Name of the variable. */
     char *function;   /* Name of the calling function. */
{
  if (array == (void *)NULL) array = (void *)malloc(size);
  else array = (void *)realloc(array, size);

  if (array == (void *)NULL)
    {
      fprintf(stderr, "Cannot realloc space for \"%s\" in the ", variable);
      fprintf(stderr, "\"%s\" function.\n", function);
      exit(1);
    }
  else
    return(array);
}

/* Realloc an array with an error message and an exit if unsuccessful.
 * Also, checks whether "array" is equal to NUll, if so, uses "malloc()"
 * to avoid problems with compilers that cannot realloc NULL pointers. */
void *recalloc_error(array, elt_count, elt_size, variable, function)
     void *array;          /* The array whose size is to be modified. */
     int elt_count;        /* Number of elements in the array. */
     unsigned elt_size;    /* Size of each element. */
     char *variable;       /* Name of the variable. */
     char *function;       /* Name of the calling function. */
{
  if (array == (void *)NULL)
    array = (void *)malloc((unsigned)elt_count * elt_size);
  else array = (void *)realloc(array, (unsigned)elt_count * elt_size);

  if (array == (void *)NULL)
    {
      fprintf(stderr, "Cannot recalloc space for \"%s\" in the ", variable);
      fprintf(stderr, "\"%s\" function.\n", function);
      exit(1);
    }
  else return(array);
}

/* Free dynamic memory, but do nothing if handed a NULL pointer. */
void free_error(array, variable, function)
     void *array;
     char *variable;   /* Name of the variable. */
     char *function;   /* Name of the calling function. */
{
  if (array != (void *)NULL) free(array);
}


/* A general function for reporting program bugs. */
void bug_report(function)
     char *function;
{
  fprintf(stderr, "PROGRAM BUG: %s\n", function);
  exit(1);
}
