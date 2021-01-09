#######################################
## Design oligos for enhancer tilling
## hebin
## May 4th 09
#######################################


# ~~~~~~ file io ~~~~~~~
open input file, read in the alignment, store each alignment in a separate string; @seq;
open IN, file;
my @SEQname = ();
my @SEQ = ();
while(my $line = <IN>){
    chomp $line;
    if($line =~ />/){
	@SEQname = (@SEQname, $line);
	$line = <IN>;
	chomp;
	@SEQ = (@SEQ, $line);
    }
}
my $length = length $SEQ[0];

# ~~~~~~ Global Parameters ~~~~~~

my $N = 20; ## length of oligos
my $m = 10; ## overlap betn two oligos
my @abspos = 0; ## record absolute positions of reference oligos, in the form of (start 1, end 1, start 2, end 2...)

# ~~~~~~ 1 Reference set based on mel ~~~~~~~
my $pos = 0; ## pointer in the sequence;

while(($pos+$N) <= $length){
    ## generate the oligo, record the absolute position;
    @abspos = (@abspos, $pos); ## record the start position
    my $oligo = '';
    my $cnt = 0; ## counter
    while($cnt < $N && $pos < $length){
	my $temp = substr($SEQ[0], $pos, 1);
	if($temp ne "-"){
	    $cnt ++;
	    $oligo = $oligo.$temp;
	}
	$pos ++;
    }
    @abspos = (@abspos, $pos);
    print $oligo;
}
