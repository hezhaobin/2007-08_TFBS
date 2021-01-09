/* Declare housekeeping functions defined in "alloc_error.c". */


/* Malloc with an error message and an exit if unsuccessful. */
extern void *malloc_error();

/* Calloc with an error message and an exit if unsuccessful.
 * Also, the element count is an "int" rather than an "unsigned". */
extern void *calloc_error();

/* Realloc with an error message and an exit if unsuccessful.  Also,
 * checks whether "array" is equal to NUll, if so, uses "malloc()" to
 * avoid problems with compilers that cannot realloc NULL pointers. */
extern void *realloc_error();

/* Realloc an array with an error message and an exit if unsuccessful.
 * Also, checks whether "array" is equal to NUll, if so, uses "malloc()"
 * to avoid problems with compilers that cannot realloc NULL pointers. */
extern void *recalloc_error();

/* Free dynamic memory, but do nothing if handed a NULL pointer. */
extern void free_error();

/* A general function for reporting program bugs. */
extern void bug_report();
