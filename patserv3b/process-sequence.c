/* Copyright 1990, 1994, 1996 Gerald Z. Hertz
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


#include "options.h"


/* Determine the score of the L-mers of the current sequence.
 * The following external variables are used:
 *
 *    Comp_status           A_comp                File
 *    Thresh     	    S_fp  		  Fp
 *    L_thresh   	    Matrix		  Circle
 *    U_thresh   	    L     		  Sequence
 *    Top        	    L_1   		  Seq_length
 *    A_size
 */


/* Function for determing whether a score should be printed.  Equals either
 * "print_threshold()" or "save_top()".
 * RETURN VALUES
 *     YES: continue processing the current sequence.
 *      NO: stop the processing of the current sequence. */
static char (*print_option)();

static int STmax_idx; /* Maximum sequence index at which an L-mer can begin. */

/* Variables for printing a list of top scores. */
static int STarray_size;       /* Size of the array holding the information
				* about top scores when "Top" equals YES. */
static int STnum_top;          /* The number of top scoring L-mers in
				* the current sequence. */
static PAIR *STtop_array;      /* Array holding the information about
				* top scores when "Top" equals YES. */


/* Initialize information for "process_sequence()". */
void init_variables()
{
  char print_threshold();  /* Print score if within threshold limits. */
  char save_top();         /* Save score if tops for current sequence. */


  /* Initialize "(*print_option)()". */
  if (Top == NO) print_option = print_threshold;
  else print_option = save_top;

  if (Top == YES)
    {
      STarray_size = CHUNK_SIZE;
      STtop_array = (PAIR *)calloc_error(STarray_size, sizeof(PAIR),
					 "STtop_array", "init_variables()");
    }
}



/* Determine the score of the L-mers of the current sequence. */
void process_sequence()
{
  int i, j;
  int circle_size;    /* Number of letters within circular wrap around. */

  int score_l_mer();       /* Score the current L-mer. */
  void print_top_scores(); /* Print top scores as stored in "STtop_array[]". */


  /* Initialize the number of top scores. */
  STnum_top = 0;

  /* Determine the size of the circular wraparound. */
  if (Circle == YES)
    {
      if (Seq_length >= L) circle_size = L - 1;
      else circle_size = Seq_length;
    }
  else circle_size = 0;

  /* Add the circular wraparound to the Sequence[]. */
  Sequence = (LETTER *)recalloc_error((char *)Sequence, Seq_length+circle_size,
			     sizeof(LETTER), "Sequence", "process_sequence()");
  for (i = 0, j = Seq_length; i < circle_size; ++i, ++j)
    Sequence[j] = Sequence[i];


  /* Process each L-mer of the Sequence[]. */
  for (i = 0, STmax_idx = Seq_length + circle_size - L; i <= STmax_idx; ++i)
    i = score_l_mer(i);                 /* Score the current L-mer. */

  /* Print results if only top scores for each sequence are being printed. */
  if (Top == YES) print_top_scores();

  if (Fp != S_fp) fclose(Fp);
  return;
}


/* Score the current L-mer and its complement, if desired.
 * Print the score, depending on the threshold conditions
 * and whether only the top scores are being printed.
 * Returns the index preceding the next L-mer. */
int score_l_mer(idx)
     int idx;              /* The starting index for the current L-mer. */
{
  int i, j;
  LETTER *l_mer;           /* The L-mer currently being scored. */
  int letter;              /* The current letter of the current L-mer. */
  double score;            /* Score of current L-mer or its complement. */


  /* Determine the score of the current L-mer. */
  for (i = 0, l_mer = Sequence + idx, score = 0; i < L; ++i)
    {
      letter = (int)(l_mer[i]);
      if (letter >= A_size) return(idx + i);

      score += Matrix[letter][i];
    }

  /* Print score depending on threshold conditions. */
  if ((*print_option)(1, idx, score) == NO) return(STmax_idx);


  if (Comp_status == YES)
    {
      /* Determine the score of the current L-mer's complement. */
      for (i = 0, j = L_1, score = 0; i < L; ++i, --j)
	{
	  letter = A_comp[(int)(l_mer[j])];
	  score += Matrix[letter][i];
	}

      /* Print score depending on threshold conditions. */
      if ((*print_option)(-1, idx, score) == NO) return(STmax_idx);
    }

  return(idx);
}


/* "(*print_option)()" is the function for determing whether a score
 * should be printed.  Equals either
 *     print_threshold(): Top == NO
 *     save_top(): Top == YES.
 * RETURN VALUES
 *     YES: continue processing the current sequence.
 *      NO: stop the processing of the current sequence.
 */

/* Determine whether the score of the current L-mer should be printed.
 * YES: continue processing the current sequence (always returns YES). */
char print_threshold(comp_strand, idx, score)
     int comp_strand;   /* Flag for whether L-mer is from complementary strand.
			 * 1: not from complement; -1: from complement. */
     int idx;           /* The starting index for the current L-mer. */
     double score;      /* Score of current L-mer or its complement. */
{
  int status = NO;    /* Status of whether score is within threshold limits. */
  int position;         /* Position of the score within the sequence. */
  void print_score();   /* Print a score. */


  /* Determine whether the score is within the threshold limits. */
  switch (Thresh)
    {
    case '\0':
      status = YES;
      break;
    case 'l':
      if (score >= L_thresh)
	status = YES;
      break;
    case 'u':
      if (score < U_thresh)
	status = YES;
      break;
    case 'b':
      if ((score >= L_thresh) && (score < U_thresh))
	status = YES;
      break;
    default:
      fprintf(stderr, "PROGRAM BUG: print_option\n");
    }

  /* Print the results if "status" equals YES. */
  if (status == YES)
    {
      position = idx + 1;
      if (comp_strand < 0) position = -position;

      print_score(File, position, score);
    }

  return(YES);
}

/* Determine whether the score of the current L-mer is a top score
 * and should be printed.  RETURN VALUES
 *     YES: continue processing the current sequence.
 *      NO: stop the processing of the current sequence
 *          if upper threshold has been exceeded. */
char save_top(comp_strand, idx, score)
     int comp_strand;   /* Flag for whether L-mer is from complementary strand.
			 * 1: not from complement; -1: from complement. */
     int idx;           /* The starting index for the current L-mer. */
     double score;      /* Score of current L-mer or its complement. */
{
  /* Return to calling function if score is less than the lower threshold. */
  if (((Thresh == 'l') || (Thresh == 'b')) && (score < L_thresh))
    return(YES);

  /* Quit processing the sequence if greater than the upper threshold. */
  if (((Thresh == 'u') || (Thresh == 'b')) && (score >= U_thresh))
    {
      STnum_top = 0;
      return(NO);
    }


  /* The first L-mer is automatically the top scoring L-mer so far. */
  if (STnum_top <= 0)
    {
      STtop_array[0].position = comp_strand * (idx + 1);
      STtop_array[0].score = score;
      STnum_top = 1;
    }

  /* Determine whether new score is tied with the old top score for
   * the current sequence.  Complicated by the need for leeway when
   * determining whether two floating point numbers are equal. */
  else if ((score == STtop_array[0].score) ||
	   ((STtop_array[0].score != 0.0) &&
	    (fabs(score - STtop_array[0].score) /
	     fabs(STtop_array[0].score) <= ERROR)))
    {
      if (STnum_top >= STarray_size)
	{
	  STarray_size = STarray_size + CHUNK_SIZE;
	  STtop_array = (PAIR *)realloc_error((char *)STtop_array,
					 (unsigned)STarray_size * sizeof(PAIR),
					"STtop_array", "print_option()");
	}
      STtop_array[STnum_top].position = comp_strand * (idx + 1);
      STtop_array[STnum_top].score = score;
      ++STnum_top;
    }

  /* Determine whether new score is greater than the old top score for
   * the current sequence.  Simplified by checking for equality first. */
  else if (score > STtop_array[0].score)
    {
      STtop_array[0].position = comp_strand * (idx + 1);
      STtop_array[0].score = score;
      STnum_top = 1;
    }


  return(YES);
}


/* Print the top scores as stored in "STtop_array[]". */
void print_top_scores()
{
  int i;
  int position;         /* The position of the current L-mer. */
  double score;         /* Score of current L-mer or its complement. */
  void print_score();   /* Print a score. */

  for (i = 0; i < STnum_top; ++i)
    {
      position = STtop_array[i].position;
      score = STtop_array[i].score;

      print_score(File, position, score);
    }
}


/* Print a score. */
void print_score(seq_name, position, score)
     char *seq_name;           /* Name of the sequence being scored. */
     int position;             /* Position being scored.  A negative position
				* number means the score is on the
				* complementary strand. */
     double score;             /* The score. */
{
  void extract_marginal_prob(); /* Extract and print marginal
				 * probability from Marginal_prob[]. */


  /* L-mer is not on the complementary strand. */
  if (position > 0)
    printf("%*s  position= %6d  score= ",
	   NAME_LENGTH, seq_name, position);

  /* L-mer is on the complementary strand. */
  else
    printf("%*s  position= %6dC score= ",
	   NAME_LENGTH, seq_name, abs(position));

  if ((score < -INFINITY / 2.0) ||
#ifdef TEST
      (score < Min_exact_score - 1.0 / Multiple) ||
#endif
      (score < Min_exact_score - ERROR * fabs(Min_exact_score)))
    printf("-INFINITY");

  else printf("%6.2f", score);

  extract_marginal_prob(score);
  printf("\n");
}
