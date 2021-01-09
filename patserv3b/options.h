/* Copyright 1990, 1994, 1995, 1996 Gerald Z. Hertz
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


#ifdef VMS
#include stdio
#include math
#include ctype
#include string
#include stdlib
#else
#include <stdio.h>
#include <math.h>
#include <ctype.h>
#include <string.h>
#include <stdlib.h>
#endif

#include "definitions.h"
#include "alloc-error.h"


/* Declaration of global variables:
  * Input files.
  * Limiting the scores to print.
  * Alphabet options.
  * File pointers.
  * Matrix file.
  * Determined by file containing the list of sequence files.
  * Determined by the contents of the sequence files.
  */


/* Testing flag indicating calculations of cutoff scores are being tested. */
extern char Test;


/* Input files. */
extern char *Mat_file;
extern char *Alpha_file;
extern char *Seq_file;


/* Adjusting or restricting which scores are printed. */
extern char Comp_status;
extern char Thresh;
extern double L_thresh;
extern double U_thresh;
extern char Top;
extern char Error;


/* Alphabet options. */
extern char Ascii;
extern char Case_sensitive;
extern char Comp_flag;
extern int A_size;
extern int *A;
extern int *A_comp;
extern double *P;


/* File pointers. */
extern FILE *M_fp;
extern FILE *S_fp;


/* Matrix file. */
extern char Sum_mat;
extern double Fudge;
extern char Vertical;
extern double **Matrix;
extern double **Align_mat;
extern int L;
extern int L_1;
extern char *Letter_array;
extern int *Letter_index;
extern char Print;

/* Information contents. */
extern double Inf;
extern double Inf_adj;
extern double Inf_fudge;

/* Determined by file containing the list of sequence files. */
extern char File[];
extern FILE *Fp;
extern char Circle;


/* Determined by the contents of a sequence file. */
extern LETTER *Sequence;
extern int Seq_length;


/* Variables for determining the array of marginal probabilities
 * for integer scores. */
extern double *Marginal_prob;
extern double Max_int_range;
extern double Min_score;
extern double Multiple;
extern double Max_exact_score;
extern double Min_exact_score;
extern double Min_pseudo_score;
extern char Minus_inf;
extern int Max_int_score;
extern int Min_int_score;
extern double *ArrayA;
extern double *Ln_P;
extern int Skip;
