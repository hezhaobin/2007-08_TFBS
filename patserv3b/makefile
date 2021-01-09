# Description file for the "patser-v3" program.

CFLAGS = -O2         # The basic version (optimized version)
#CFLAGS = -O2 -p     # Version for profiling function use (optimized version)
#CFLAGS = -g         # The version for debugging (limited optimization)

#CPPFLAGS = -DTEST   # Defined only when patser-v3b.test is compiled
SGI = cc -O3 -cckr

#CC = cc
CC = gcc

OBJ = options.o main.o command-line.o print-directions.o parse-line.o alpha.o\
	process-matrix.o read-matrix.o det-marginal-prob.o\
	read-sequence.o process-sequence.o alloc-error.o
OBJ_TEST = cutoff-exact.o cutoff-analytical.o gamma-prob.o root-find.o

SRC = options.c main.c command-line.c print-directions.c parse-line.c alpha.c\
	process-matrix.c read-matrix.c det-marginal-prob.c\
	read-sequence.c process-sequence.c alloc-error.c
SRC_TEST = cutoff-exact.c cutoff-analytical.c gamma-prob.c root-find.c

SRC_H = definitions.h alloc-error.h options.h parse-line.h alpha.h


patser-v3b : $(OBJ)
	$(CC) $(CFLAGS) -o patser-v3b $(OBJ) -lm
lint :
	lint $(SRC)
tar :
	tar -chvf patser-v3b.tar directions makefile $(SRC_H) $(SRC)
patser-v3b.sgi : $(SRC)
	$(SGI) -o patser-v3b $(SRC) -lm


patser-v3b.test : $(OBJ) $(OBJ_TEST)
	$(CC) $(CFLAGS) -o patser-v3b.test $(OBJ) $(OBJ_TEST) -lm
lint.test :
	lint $(SRC) $(SRC_TEST)
tar.test :
	tar -chvf patser-v3b.test.tar\
		directions makefile $(SRC_H) $(SRC) $(SRC_TEST)


options.o : definitions.h
main.o : definitions.h alloc-error.h options.h
command-line.o : definitions.h alloc-error.h options.h parse-line.h alpha.h
print-directions.o :
parse-line.o : parse-line.h
alpha.o : definitions.h alloc-error.h options.h
process-matrix.o : definitions.h alloc-error.h options.h
read-matrix.o : definitions.h alloc-error.h options.h
det-marginal-prob.o : definitions.h alloc-error.h options.h
cutoff-exact.o : definitions.h alloc-error.h options.h
cutoff-analytical.o : definitions.h alloc-error.h options.h
read-sequence.o : definitions.h alloc-error.h options.h
process-sequence.o : definitions.h alloc-error.h options.h
gamma-prob.o : definitions.h alloc-error.h options.h
root-find.o : 
alloc-error.o :
