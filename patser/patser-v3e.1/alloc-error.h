/* Copyright 1997, 2001 Gerald Z. Hertz
 * May be copied for noncommercial purposes.
 *
 * Author:
 *   Gerald Z. Hertz
 *   hertz@colorado.edu
 */


/* Declare housekeeping functions defined in "alloc_error.c" and
 * "alloc-error-debug.c". */


/* Malloc with an error message and an exit if unsuccessful. */
extern void *malloc_error(
     size_t size,               /* Size of the array. */
     const char *variable,      /* Name of the variable. */
     const char *function);     /* Name of the calling function. */

/* Calloc with an error message and an exit if unsuccessful.
 * Also, the element count is an "int" rather than a "size_t". */
extern void *calloc_error(
     int elt_count,             /* Number of elements in the array. */
     size_t elt_size,           /* Size of each element. */
     const char *variable,      /* Name of the variable. */
     const char *function);     /* Name of the calling function. */

/* Realloc with an error message and an exit if unsuccessful.  Also,
 * checks whether "array" is equal to NUll, if so, uses "malloc()" to
 * avoid problems with compilers that cannot realloc NULL pointers. */
extern void *realloc_error(
     void *array,               /* The array whose size is to be modified. */
     size_t size,               /* Size of the array. */
     const char *variable,      /* Name of the variable. */
     const char *function);     /* Name of the calling function. */

/* Realloc an array with an error message and an exit if unsuccessful.
 * Also, checks whether "array" is equal to NUll, if so, uses "malloc()"
 * to avoid problems with compilers that cannot realloc NULL pointers. */
extern void *recalloc_error(
     void *array,               /* The array whose size is to be modified. */
     int elt_count,             /* Number of elements in the array. */
     size_t elt_size,           /* Size of each element. */
     const char *variable,      /* Name of the variable. */
     const char *function);     /* Name of the calling function. */

/* Free dynamic memory, but do nothing if handed a NULL pointer. */
extern void free_error(
     void *array,               /* The array being freed. */
     const char *variable,      /* Name of the variable. */
     const char *function);     /* Name of the calling function. */

/* A general function for reporting program bugs. */
extern void bug_report(
     const char *function);     /* Function containing the bug. */



/* The following function is only defined in "alloc-error-debug.c".
 * In "alloc-error.c", the function is defined to do nothing. */

/* Check an array to make sure the magic ints and char are all consistent
 * with unmolested memory.  Returns a void pointer to the gross memory.
 * When called outside of "alloc-error-debug.c",  alloc_function = "check". */
extern void *check_array(
     const char *alloc_function,/* Name of allocating function.*/
     void *array,               /* Array being checked. */
     const char *variable,      /* Name of the variable. */
     const char *function);     /* Name of the calling function. */
